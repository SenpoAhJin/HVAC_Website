<?php
/**
 * Premier Tech Solution - Contact Form API
 * Stores leads in Supabase via REST API and sends email notifications
 */

// Only run as web request, not CLI
if (PHP_SAPI === 'cli') {
  exit(1);
}

// Load configuration
$privateConfigPath = dirname(__DIR__) . '/../private_config/premier_tech_config.php';
if (!file_exists($privateConfigPath)) {
  error_log('[contact.php] Config file not found: ' . $privateConfigPath);
  http_response_code(503);
  header('Content-Type: application/json');
  echo json_encode(['ok' => false, 'error' => 'unavailable']);
  exit;
}

$config = require $privateConfigPath;

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: application/json');

// 1. Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

// Check Content-Type
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') === false) {
  http_response_code(415);
  echo json_encode(['ok' => false, 'error' => 'Content-Type must be application/json']);
  exit;
}

// Enforce body size limit (512KB) - works with chunked transfer encoding
define('MAX_BODY_SIZE', 512000);
$rawInput = stream_get_contents(fopen('php://input', 'r'), MAX_BODY_SIZE + 1);

if (strlen($rawInput) > MAX_BODY_SIZE) {
  http_response_code(413);
  echo json_encode(['ok' => false, 'error' => 'Request too large']);
  exit;
}

// Parse JSON
$data = json_decode($rawInput, true);
if (json_last_error() !== JSON_ERROR_NONE) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
  exit;
}

// 2. Validate required fields with SQL limits
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = isset($data['phone']) ? trim($data['phone']) : null;
$message = trim($data['message'] ?? '');

$errors = [];

// Name: 1-100 characters
if (strlen($name) < 1 || strlen($name) > 100) {
  $errors[] = 'Name must be between 1 and 100 characters';
}

// Email: 3-254 characters, valid format
if (strlen($email) < 3 || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors[] = 'Valid email required (max 254 characters)';
}

// Phone: optional, max 30 characters
if ($phone !== null && strlen($phone) > 30) {
  $errors[] = 'Phone must be 30 characters or less';
}

// Message: 1-5000 characters
if (strlen($message) < 1 || strlen($message) > 5000) {
  $errors[] = 'Message must be between 1 and 5000 characters';
}

if (!empty($errors)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => implode('. ', $errors)]);
  exit;
}

// Sanitize inputs
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$phone = $phone ? htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') : null;
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// 3. Compute ip_hash and user_agent
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$clientIp = explode(',', $clientIp)[0]; // Take first IP if multiple
$ipHash = hash('sha256', $config['security']['IP_HASH_SALT'] . $clientIp);

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$userAgent = substr($userAgent, 0, 300); // Trim to 300 chars

// 4. Rate limit: 5 leads per ip_hash per hour
$oneHourAgo = gmdate('Y-m-d\TH:i:s\Z', time() - 3600);
$rateLimitUrl = $config['supabase']['SUPABASE_URL'] . '/rest/v1/leads?select=id&ip_hash=eq.' . $ipHash . '&created_at=gte.' . $oneHourAgo;

$rateLimitCheck = @file_get_contents($rateLimitUrl, false, stream_context_create([
  'http' => [
    'method' => 'GET',
    'header' => [
      'apikey: ' . $config['supabase']['SUPABASE_SECRET_KEY'],
      'Content-Type: application/json'
    ],
    'timeout' => 3
  ],
  'ssl' => [
    'verify_peer' => true,
    'verify_peer_name' => true
  ]
]));

if ($rateLimitCheck !== false) {
  $recentLeads = json_decode($rateLimitCheck, true);
  if (is_array($recentLeads) && count($recentLeads) >= 5) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Too many submissions. Please try again later.']);
    exit;
  }
} else {
  // Rate limit check failed, log it but allow request
  error_log('[contact.php] Rate limit check failed for ip_hash: ' . substr($ipHash, 0, 8) . '...');
}

// 5. Save lead to Supabase
$leadData = [
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'message' => $message,
  'ip_hash' => $ipHash,
  'user_agent' => $userAgent,
  'status' => 'new'
];

$insertUrl = $config['supabase']['SUPABASE_URL'] . '/rest/v1/leads';
$insertContext = stream_context_create([
  'http' => [
    'method' => 'POST',
    'header' => [
      'apikey: ' . $config['supabase']['SUPABASE_SECRET_KEY'],
      'Content-Type: application/json',
      'Prefer: return=minimal'
    ],
    'content' => json_encode($leadData),
    'timeout' => 8
  ],
  'ssl' => [
    'verify_peer' => true,
    'verify_peer_name' => true
  ]
]);

$insertResult = @file_get_contents($insertUrl, false, $insertContext);
$leadSaved = false;

if ($insertResult !== false || (isset($http_response_header) && strpos($http_response_header[0], '201') !== false)) {
  $leadSaved = true;
} else {
  error_log('[contact.php] Failed to save lead to Supabase');
}

// 6. Email the lead
$emailSent = false;
$emailSubject = 'New Contact Form Submission from ' . $name;
$emailBody = "New contact form submission:\n\n";
$emailBody .= "Name: {$name}\n";
$emailBody .= "Email: {$email}\n";
if ($phone) {
  $emailBody .= "Phone: {$phone}\n";
}
$emailBody .= "\nMessage:\n{$message}\n";

$headers = [
  'From: ' . $config['email']['MAIL_FROM'],
  'Reply-To: ' . $email,
  'X-Mailer: PHP/' . phpversion(),
  'Content-Type: text/plain; charset=UTF-8'
];

if (@mail($config['email']['MAIL_TO'], $emailSubject, $emailBody, implode("\r\n", $headers))) {
  $emailSent = true;
} else {
  error_log('[contact.php] Failed to send email notification');
}

// 7. Outcomes
if ($leadSaved || $emailSent) {
  http_response_code(200);
  echo json_encode(['ok' => true, 'message' => 'Thank you for contacting us. We will respond soon.']);
  
  if (!$leadSaved) {
    error_log('[contact.php] Lead saved: NO, Email sent: YES');
  } else if (!$emailSent) {
    error_log('[contact.php] Lead saved: YES, Email sent: NO');
  }
} else {
  http_response_code(503);
  echo json_encode(['ok' => false, 'error' => 'unavailable']);
}

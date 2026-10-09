<?php
/**
 * Premier Tech Solution - Contact Form API
 * Stores leads in Supabase via REST API and sends email notifications
 */

// Only run as web request, not CLI
if (PHP_SAPI === 'cli') {
  exit(1);
}

// Load shared validator
require __DIR__ . '/config-validator.php';

// Load configuration
// Path resolution from /home/username/public_html/premiertechsolution.us/api/contact.php:
// __DIR__ = /home/username/public_html/premiertechsolution.us/api
// dirname(__DIR__, 3) = /home/username
// Target: /home/username/private_config/premier_tech_config.php
$privateConfigPath = dirname(__DIR__, 3) . '/private_config/premier_tech_config.php';
if (!file_exists($privateConfigPath)) {
  error_log('[contact.php] Config file not found');
  http_response_code(503);
  header('Content-Type: application/json');
  echo json_encode(['ok' => false, 'error' => 'unavailable']);
  exit;
}

$config = require $privateConfigPath;

// Validate config
$validation = validate_config($config);
if (!$validation['valid']) {
  error_log('[contact.php] Config validation failed');
  http_response_code(503);
  header('Content-Type: application/json');
  echo json_encode(['ok' => false, 'error' => 'unavailable']);
  exit;
}

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

// Validate UTF-8
if (!preg_match('//u', $name) || !preg_match('//u', $email) || 
    ($phone !== null && !preg_match('//u', $phone)) || !preg_match('//u', $message)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid character encoding']);
  exit;
}

// Strip control characters except line breaks (\r\n) in message
$nameClean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $name);
$emailClean = preg_replace('/[\x00-\x1F\x7F]/u', '', $email);
$phoneClean = $phone !== null ? preg_replace('/[\x00-\x1F\x7F]/u', '', $phone) : null;
$messageClean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $message);

// Guard against null results from preg_replace
if ($nameClean === null || $emailClean === null || ($phone !== null && $phoneClean === null) || $messageClean === null) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid character encoding']);
  exit;
}

$name = $nameClean;
$email = $emailClean;
$phone = $phoneClean;
$message = $messageClean;

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

// 3. Compute ip_hash and user_agent
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ipHash = hash('sha256', $config['security']['IP_HASH_SALT'] . $clientIp);

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
// Reduce to printable ASCII before trimming
$userAgent = preg_replace('/[^\x20-\x7E]/', '', $userAgent);
$userAgent = substr($userAgent, 0, 300); // Trim to 300 chars

// 4. Rate limit: 5 leads per ip_hash per hour
$oneHourAgo = gmdate('Y-m-d\TH:i:s\Z', time() - 3600);
$rateLimitUrl = $config['supabase']['SUPABASE_URL'] . '/rest/v1/leads?select=id&ip_hash=eq.' . rawurlencode($ipHash) . '&created_at=gte.' . rawurlencode($oneHourAgo);

$supabaseHeaders = get_supabase_headers($config['supabase']['SUPABASE_SECRET_KEY']);
$supabaseHeaders[] = 'Content-Type: application/json';

$rateLimitCheck = @file_get_contents($rateLimitUrl, false, stream_context_create([
  'http' => [
    'method' => 'GET',
    'header' => $supabaseHeaders,
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

$leadJson = json_encode($leadData, JSON_INVALID_UTF8_SUBSTITUTE);
if ($leadJson === false) {
  error_log('[contact.php] JSON encoding failed');
  http_response_code(503);
  echo json_encode(['ok' => false, 'error' => 'unavailable']);
  exit;
}

$insertUrl = $config['supabase']['SUPABASE_URL'] . '/rest/v1/leads';
$insertHeaders = get_supabase_headers($config['supabase']['SUPABASE_SECRET_KEY']);
$insertHeaders[] = 'Content-Type: application/json';
$insertHeaders[] = 'Prefer: return=minimal';

$insertContext = stream_context_create([
  'http' => [
    'method' => 'POST',
    'header' => $insertHeaders,
    'content' => $leadJson,
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

// Fixed subject with no visitor input
$emailSubject = 'New Contact Form Submission';

// Plain text body
$emailBody = "New contact form submission:\n\n";
$emailBody .= "Name: {$name}\n";
$emailBody .= "Email: {$email}\n";
if ($phone) {
  $emailBody .= "Phone: {$phone}\n";
}
$emailBody .= "\nMessage:\n{$message}\n";

// Strip CR/LF from all header values
$mailFrom = str_replace(["\r", "\n"], '', $config['email']['MAIL_FROM']);
$replyToEmail = str_replace(["\r", "\n"], '', $email);

// Build headers
$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: ' . $mailFrom,
  'X-Mailer: PHP/' . phpversion()
];

// Add Reply-To only if email is valid
if (filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
  $headers[] = 'Reply-To: ' . $replyToEmail;
}

// Use -f parameter only if MAIL_FROM is valid
$additionalParams = '';
if (filter_var($config['email']['MAIL_FROM'], FILTER_VALIDATE_EMAIL)) {
  $additionalParams = '-f' . $config['email']['MAIL_FROM'];
}

if (@mail($config['email']['MAIL_TO'], $emailSubject, $emailBody, implode("\r\n", $headers), $additionalParams)) {
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

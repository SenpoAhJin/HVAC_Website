<?php
/**
 * Contact Form API Endpoint
 * Handles form submissions, stores leads in MySQL, and sends email notifications
 * 
 * Security: Rate limiting, honeypot, input validation, prepared statements only
 */

// Prevent direct access to this file via browser
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: application/json');

// Load configuration - check multiple locations in priority order
// NEVER use a path inside public web root as the preferred location
$configPaths = [
    // 1. Home directory (most secure - outside web root)
    (getenv('HOME') ?: (function_exists('posix_getpwuid') ? posix_getpwuid(posix_geteuid())['dir'] : '')) . '/private/hvac-config.php',
    // 2. Two levels up from api/ (outside public_html)
    dirname(__DIR__, 2) . '/private/hvac-config.php',
    // 3. Fallback in api/ (protected by .htaccess)
    __DIR__ . '/config.php'
];

$configLoaded = false;
foreach ($configPaths as $path) {
    if (!empty($path) && file_exists($path)) {
        require_once $path;
        $configLoaded = true;
        break;
    }
}

if (!$configLoaded) {
    error_log('Contact API: No configuration file found. Checked: ' . implode(', ', array_filter($configPaths)));
    http_response_code(500);
    echo json_encode(['error' => 'Service temporarily unavailable']);
    exit;
}

// Rate limiting configuration
define('RATE_LIMIT_MAX', 5);  // Max submissions per time window
define('RATE_LIMIT_WINDOW', 600); // 10 minutes in seconds

// Maximum request size (500KB)
if (isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > 512000) {
    http_response_code(413);
    echo json_encode(['error' => 'Request too large']);
    exit;
}

/**
 * Validate origin/referer to prevent CSRF
 */
function validateOrigin($siteUrl) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    
    if (empty($origin) && empty($referer)) {
        return true; // Allow if neither is present (some clients don't send)
    }
    
    $allowedHost = parse_url($siteUrl, PHP_URL_HOST);
    
    if (!empty($origin)) {
        $originHost = parse_url($origin, PHP_URL_HOST);
        if ($originHost === $allowedHost) return true;
    }
    
    if (!empty($referer)) {
        $refererHost = parse_url($referer, PHP_URL_HOST);
        if ($refererHost === $allowedHost) return true;
    }
    
    return false;
}

/**
 * Get client IP address
 * Only trusts proxy headers if TRUST_PROXY config is true
 */
function getClientIp() {
    // Default: use REMOTE_ADDR (direct connection)
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Only trust proxy headers if explicitly configured
    if (defined('TRUST_PROXY') && TRUST_PROXY === true) {
        // Check CloudFlare header
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
        }
        // Check X-Forwarded-For (use first IP in chain)
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $forwardedIps = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = trim($forwardedIps[0]);
        }
    }
    
    return $ip;
}

/**
 * Hash IP address for privacy-preserving storage
 */
function hashIp($ip) {
    return hash('sha256', $ip . 'hvac_salt_2025');
}

/**
 * Check rate limit for given IP
 */
function checkRateLimit($pdo, $ipHash) {
    try {
        // Purge old entries (1 in 20 requests to reduce DB load)
        // Clean entries older than 1 day
        if (rand(1, 20) === 1) {
            $purgeStmt = $pdo->prepare(
                "DELETE FROM rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)"
            );
            $purgeStmt->execute();
        }
        
        // Clean up rate limit entries for the current window
        $cleanupStmt = $pdo->prepare(
            "DELETE FROM rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL :window SECOND)"
        );
        $cleanupStmt->execute(['window' => RATE_LIMIT_WINDOW]);
        
        // Count recent submissions from this IP
        $stmt = $pdo->prepare(
            "SELECT COUNT(*) as count FROM rate_limits 
             WHERE ip_hash = :ip_hash 
             AND created_at >= DATE_SUB(NOW(), INTERVAL :window SECOND)"
        );
        $stmt->execute([
            'ip_hash' => $ipHash,
            'window' => RATE_LIMIT_WINDOW
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'] < RATE_LIMIT_MAX;
        
    } catch (PDOException $e) {
        error_log('Rate limit check error: ' . $e->getMessage());
        return true; // Fail open - allow submission if rate limit check fails
    }
}

/**
 * Record rate limit entry
 */
function recordRateLimit($pdo, $ipHash) {
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO rate_limits (ip_hash, created_at) VALUES (:ip_hash, NOW())"
        );
        $stmt->execute(['ip_hash' => $ipHash]);
    } catch (PDOException $e) {
        error_log('Rate limit record error: ' . $e->getMessage());
    }
}

/**
 * Send email notification using PHPMailer
 */
function sendEmailNotification($data, $config) {
    require_once __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
    require_once __DIR__ . '/vendor/PHPMailer/SMTP.php';
    require_once __DIR__ . '/vendor/PHPMailer/Exception.php';
    
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['SMTP_USER'];
        $mail->Password = $config['SMTP_PASS'];
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['SMTP_PORT'];
        
        // Recipients
        $mail->setFrom($config['MAIL_FROM'], 'Premier Tech Solution Website');
        $mail->addAddress($config['MAIL_TO']);
        $mail->addReplyTo($data['email'], $data['name']);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission - Premier Tech Solution';
        
        $phoneDisplay = !empty($data['phone']) 
            ? "<p><strong>Phone:</strong> " . htmlspecialchars($data['phone']) . "</p>" 
            : "";
        
        $mail->Body = "
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> " . htmlspecialchars($data['name']) . "</p>
            <p><strong>Email:</strong> " . htmlspecialchars($data['email']) . "</p>
            {$phoneDisplay}
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($data['message'])) . "</p>
            <hr>
            <p style='color: #666; font-size: 12px;'>Submitted: " . date('Y-m-d H:i:s') . "</p>
        ";
        
        $mail->AltBody = "New Contact Form Submission\n\n"
            . "Name: " . $data['name'] . "\n"
            . "Email: " . $data['email'] . "\n"
            . (!empty($data['phone']) ? "Phone: " . $data['phone'] . "\n" : "")
            . "Message:\n" . $data['message'] . "\n\n"
            . "Submitted: " . date('Y-m-d H:i:s');
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        error_log('Email send error: ' . $e->getMessage());
        return false;
    }
}

// Main execution
try {
    // Validate origin
    if (!validateOrigin(SITE_URL)) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid request origin']);
        exit;
    }
    
    // Parse input (support both JSON and form data)
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit;
        }
    } else {
        $input = $_POST;
    }
    
    // Honeypot check - if filled, reject silently
    if (!empty($input['website'] ?? '')) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Thank you for your message']);
        exit;
    }
    
    // Validate required fields
    $errors = [];
    
    if (empty($input['name']) || strlen(trim($input['name'])) < 2) {
        $errors[] = 'Name is required (minimum 2 characters)';
    }
    if (empty($input['email']) || !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Valid email is required';
    }
    if (empty($input['message']) || strlen(trim($input['message'])) < 10) {
        $errors[] = 'Message is required (minimum 10 characters)';
    }
    
    // Max lengths
    if (strlen($input['name'] ?? '') > 100) {
        $errors[] = 'Name is too long (max 100 characters)';
    }
    if (strlen($input['email'] ?? '') > 255) {
        $errors[] = 'Email is too long (max 255 characters)';
    }
    if (strlen($input['phone'] ?? '') > 20) {
        $errors[] = 'Phone is too long (max 20 characters)';
    }
    if (strlen($input['message'] ?? '') > 5000) {
        $errors[] = 'Message is too long (max 5000 characters)';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => 'Validation failed', 'details' => $errors]);
        exit;
    }
    
    // Sanitize input
    $data = [
        'name' => trim($input['name']),
        'email' => trim(strtolower($input['email'])),
        'phone' => trim($input['phone'] ?? ''),
        'message' => trim($input['message'])
    ];
    
    // Get IP hash for rate limiting
    $clientIp = getClientIp();
    $ipHash = hashIp($clientIp);
    
    // Connect to database
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
    } catch (PDOException $e) {
        error_log('Database connection error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Service temporarily unavailable']);
        exit;
    }
    
    // Check rate limit
    if (!checkRateLimit($pdo, $ipHash)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests. Please try again later.']);
        exit;
    }
    
    // Insert lead into database FIRST
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO leads (name, email, phone, message, ip_hash, created_at, email_sent) 
             VALUES (:name, :email, :phone, :message, :ip_hash, NOW(), 0)"
        );
        
        $stmt->execute([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'message' => $data['message'],
            'ip_hash' => $ipHash
        ]);
        
        $leadId = $pdo->lastInsertId();
        
    } catch (PDOException $e) {
        error_log('Database insert error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Unable to process your request. Please try again later.']);
        exit;
    }
    
    // Record rate limit
    recordRateLimit($pdo, $ipHash);
    
    // Try to send email notification
    $emailConfig = [
        'SMTP_HOST' => SMTP_HOST,
        'SMTP_PORT' => SMTP_PORT,
        'SMTP_USER' => SMTP_USER,
        'SMTP_PASS' => SMTP_PASS,
        'MAIL_TO' => MAIL_TO,
        'MAIL_FROM' => MAIL_FROM
    ];
    
    $emailSent = sendEmailNotification($data, $emailConfig);
    
    // Update email_sent status
    try {
        $updateStmt = $pdo->prepare("UPDATE leads SET email_sent = :sent WHERE id = :id");
        $updateStmt->execute([
            'sent' => $emailSent ? 1 : 0,
            'id' => $leadId
        ]);
    } catch (PDOException $e) {
        error_log('Email status update error: ' . $e->getMessage());
    }
    
    // Always return success if lead was saved (even if email failed)
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message. We will be in touch soon.'
    ]);
    
} catch (Exception $e) {
    error_log('Unexpected error in contact form: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An unexpected error occurred. Please try again later.']);
}

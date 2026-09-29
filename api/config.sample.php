<?php
/**
 * Sample Configuration File for Premier Tech Solution Contact API
 * 
 * IMPORTANT: Copy this file to create your actual config:
 * 
 * RECOMMENDED (secure, outside web root):
 *   Copy to: /home/username/private/hvac-config.php
 *   (Two levels above public_html)
 * 
 * FALLBACK (inside web root, protected by .htaccess):
 *   Copy to: api/config.php
 * 
 * Then fill in your actual values. Never commit the real config.php to Git!
 */

// Database Configuration
define('DB_HOST', 'localhost');                    // Usually 'localhost' on shared hosting
define('DB_NAME', 'your_database_name');           // Database name from cPanel
define('DB_USER', 'your_database_user');           // Database user from cPanel
define('DB_PASS', 'your_database_password');       // Database password from cPanel

// SMTP Configuration (for sending email notifications)
define('SMTP_HOST', 'mail.yourdomain.com');        // SMTP server (often mail.yourdomain.com)
define('SMTP_PORT', 587);                          // Usually 587 for TLS, or 465 for SSL
define('SMTP_USER', 'noreply@yourdomain.com');     // Email account username
define('SMTP_PASS', 'your_email_password');        // Email account password

// Email Addresses
define('MAIL_TO', 'contact@yourdomain.com');       // Where to send notifications
define('MAIL_FROM', 'noreply@yourdomain.com');     // From address (should match SMTP_USER)

// Site Configuration
define('SITE_URL', 'https://yourdomain.com');      // Your site URL (for CSRF protection)

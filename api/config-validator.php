<?php
/**
 * Premier Tech Solution - Configuration Validator
 * Validates config and returns array with validation results
 */

function validate_config($config) {
  $errors = [];
  
  // SUPABASE_URL: must match ^https://[a-z0-9-]+\.supabase\.co$
  if (!isset($config['supabase']['SUPABASE_URL']) || 
      !preg_match('/^https:\/\/[a-z0-9-]+\.supabase\.co$/', $config['supabase']['SUPABASE_URL'])) {
    $errors[] = 'SUPABASE_URL invalid';
  }
  
  // SUPABASE_SECRET_KEY: must start with sb_secret_, no spaces, not placeholder
  $key = $config['supabase']['SUPABASE_SECRET_KEY'] ?? '';
  if (empty($key) || 
      strpos($key, ' ') !== false ||
      $key === 'PASTE_YOUR_SECRET_KEY_HERE' ||
      (!str_starts_with($key, 'sb_secret_') && !str_starts_with($key, 'eyJ'))) {
    $errors[] = 'SUPABASE_SECRET_KEY invalid';
  }
  
  // IP_HASH_SALT: at least 32 characters, not placeholder
  $salt = $config['security']['IP_HASH_SALT'] ?? '';
  if (strlen($salt) < 32 || strpos($salt, 'random-string-here') !== false) {
    $errors[] = 'IP_HASH_SALT invalid';
  }
  
  // MAIL_TO: valid email, not example.com
  $mailTo = $config['email']['MAIL_TO'] ?? '';
  if (!filter_var($mailTo, FILTER_VALIDATE_EMAIL) || str_ends_with($mailTo, 'example.com')) {
    $errors[] = 'MAIL_TO invalid';
  }
  
  // MAIL_FROM: valid email, not example.com
  $mailFrom = $config['email']['MAIL_FROM'] ?? '';
  if (!filter_var($mailFrom, FILTER_VALIDATE_EMAIL) || str_ends_with($mailFrom, 'example.com')) {
    $errors[] = 'MAIL_FROM invalid';
  }
  
  return [
    'valid' => empty($errors),
    'errors' => $errors
  ];
}

/**
 * Build Supabase HTTP headers based on key type
 * sb_secret_* keys use only apikey header
 * eyJ* (JWT) keys use both apikey and Authorization Bearer
 */
function get_supabase_headers($key) {
  $headers = ['apikey: ' . $key];
  
  // Legacy JWT keys need Authorization header too
  if (str_starts_with($key, 'eyJ')) {
    $headers[] = 'Authorization: Bearer ' . $key;
  }
  
  return $headers;
}

<?php
/**
 * Premier Tech Solution - Supabase Keep-Alive
 * Lightweight Supabase connection check for cron jobs
 * Prevents Free tier pause after 7 days of inactivity
 */

// Only run from CLI (cron), never from web
if (PHP_SAPI !== 'cli') {
  exit(1);
}

// Load shared validator
require __DIR__ . '/config-validator.php';

// Load configuration
$privateConfigPath = dirname(__DIR__) . '/../private_config/premier_tech_config.php';
if (!file_exists($privateConfigPath)) {
  echo "FAILED: bad config\n";
  exit(1);
}

$config = require $privateConfigPath;

// Validate config
$validation = validate_config($config);
if (!$validation['valid']) {
  echo "FAILED: bad config\n";
  exit(1);
}

// Perform lightweight GET on leads table (limit=1)
$url = $config['supabase']['SUPABASE_URL'] . '/rest/v1/leads?select=id&limit=1';

$headers = get_supabase_headers($config['supabase']['SUPABASE_SECRET_KEY']);
$headers[] = 'Content-Type: application/json';

$context = stream_context_create([
  'http' => [
    'method' => 'GET',
    'header' => $headers,
    'timeout' => 8
  ],
  'ssl' => [
    'verify_peer' => true,
    'verify_peer_name' => true
  ]
]);

$result = @file_get_contents($url, false, $context);

if ($result !== false && isset($http_response_header)) {
  $statusLine = $http_response_header[0];
  if (strpos($statusLine, '200') !== false) {
    echo "OK 200\n";
    exit(0);
  } else {
    preg_match('/\d{3}/', $statusLine, $matches);
    $status = $matches[0] ?? 'unknown';
    echo "FAILED " . $status . "\n";
    exit(1);
  }
} else {
  echo "FAILED: Connection error\n";
  exit(1);
}

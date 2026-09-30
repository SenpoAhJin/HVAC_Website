<?php
/**
 * Premier Tech Solution - Configuration Template
 * 
 * Copy this file to: /home/username/private_config/premier_tech_config.php
 * (Replace 'username' with your cPanel username)
 * 
 * IMPORTANT: Never commit the real config file to git!
 */

return [
  'supabase' => [
    'SUPABASE_URL' => 'https://xxxxxxxxxxxxx.supabase.co',
    'SUPABASE_SECRET_KEY' => 'PASTE_YOUR_SECRET_KEY_HERE',
  ],
  
  'email' => [
    'MAIL_TO' => 'info@example.com',
    'MAIL_FROM' => 'noreply@example.com',
  ],
  
  'security' => [
    'IP_HASH_SALT' => 'random_string_at_least_32_chars_long_change_this_value',
  ],
];

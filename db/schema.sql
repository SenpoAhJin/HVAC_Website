-- Premier Tech Solution - Database Schema
-- MySQL/MariaDB database for storing contact form leads and rate limiting

-- Create leads table
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL DEFAULT NULL,
  `message` TEXT NOT NULL,
  `ip_hash` CHAR(64) NULL DEFAULT NULL COMMENT 'SHA-256 hash of IP address for privacy',
  `email_sent` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 if notification email was sent successfully',
  PRIMARY KEY (`id`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_email_sent` (`email_sent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Contact form leads';

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_hash` CHAR(64) NOT NULL COMMENT 'SHA-256 hash of IP address',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ip_hash_created` (`ip_hash`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rate limiting tracking';

#!/usr/bin/env php
<?php
/**
 * Test config path resolution for GreenGeeks deployment
 * Simulates the path resolution from deployed location
 */

// Simulate deployed location: /home/studen29/public_html/premiertechsolution.us/api/contact.php
$simulatedDir = '/home/studen29/public_html/premiertechsolution.us/api';

echo "=== Config Path Resolution Test ===\n\n";
echo "Simulated __DIR__: $simulatedDir\n\n";

// Method used in contact.php and keepalive.php
$resolvedPath = dirname($simulatedDir, 3) . '/private_config/premier_tech_config.php';

echo "dirname(\$simulatedDir, 3) = " . dirname($simulatedDir, 3) . "\n";
echo "Resolved config path: $resolvedPath\n\n";

// Expected path
$expectedPath = '/home/studen29/private_config/premier_tech_config.php';

if ($resolvedPath === $expectedPath) {
    echo "✅ CORRECT: Path resolves to $expectedPath\n";
    exit(0);
} else {
    echo "❌ ERROR: Path does not match expected\n";
    echo "   Expected: $expectedPath\n";
    echo "   Got:      $resolvedPath\n";
    exit(1);
}

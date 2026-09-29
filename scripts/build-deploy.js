#!/usr/bin/env node
/**
 * Build deployment package for GreenGeeks hosting
 * Assembles dist/, api/, and .htaccess into deploy/ folder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const deployDir = path.join(projectRoot, 'deploy');
const distDir = path.join(projectRoot, 'dist');
const apiDir = path.join(projectRoot, 'api');
const htaccessSource = path.join(projectRoot, 'public', '.htaccess');

console.log('🚀 Building deployment package for GreenGeeks...\n');

// Clean deploy directory
if (fs.existsSync(deployDir)) {
  console.log('🧹 Cleaning existing deploy/ folder...');
  fs.rmSync(deployDir, { recursive: true, force: true });
}

// Create deploy directory
fs.mkdirSync(deployDir, { recursive: true });

// Copy dist contents to deploy root
console.log('📦 Copying dist/ contents...');
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist/ folder not found. Run "npm run build" first.');
  process.exit(1);
}

copyRecursive(distDir, deployDir);

// Copy API folder
console.log('📡 Copying api/ folder...');
const deployApiDir = path.join(deployDir, 'api');
fs.mkdirSync(deployApiDir, { recursive: true });

// Copy all API files except config.php
const apiFiles = fs.readdirSync(apiDir);
apiFiles.forEach(file => {
  if (file === 'config.php') {
    console.log(`   ⏭️  Skipping ${file} (not for deployment)`);
    return;
  }
  
  const source = path.join(apiDir, file);
  const dest = path.join(deployApiDir, file);
  
  if (fs.statSync(source).isDirectory()) {
    copyRecursive(source, dest);
    console.log(`   ✅ Copied ${file}/`);
  } else {
    fs.copyFileSync(source, dest);
    console.log(`   ✅ Copied ${file}`);
  }
});

// Copy .htaccess if it exists
if (fs.existsSync(htaccessSource)) {
  console.log('⚙️  Copying .htaccess...');
  fs.copyFileSync(htaccessSource, path.join(deployDir, '.htaccess'));
} else {
  console.warn('⚠️  Warning: public/.htaccess not found');
}

console.log('\n✅ Deployment package ready in deploy/');
console.log('📄 See docs/DEPLOY-GREENGEEKS.md for complete instructions');

/**
 * Recursively copy directory
 */
function copyRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

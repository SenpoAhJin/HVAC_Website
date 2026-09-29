#!/usr/bin/env node
/**
 * Post-build script to replace __SITE_URL__ placeholders in dist files
 * Runs after vite build completes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = process.env.VITE_SITE_URL;

if (!siteUrl) {
  console.error('\n❌ ERROR: VITE_SITE_URL environment variable is not set!\n');
  process.exit(1);
}

const distDir = path.join(path.dirname(__dirname), 'dist');

// Files to process
const filesToProcess = [
  'robots.txt',
  'sitemap.xml'
];

console.log(`\n📝 Replacing __SITE_URL__ with ${siteUrl}...`);

for (const file of filesToProcess) {
  const filePath = path.join(distDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/__SITE_URL__/g, siteUrl);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${file}`);
  } else {
    console.warn(`⚠️  ${file} not found in dist/`);
  }
}

console.log('✅ URL replacement complete\n');

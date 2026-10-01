#!/usr/bin/env node
/**
 * Post-build script to replace __SITE_URL__ placeholders in dist files
 * Runs after vite build completes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.production
const envPath = path.join(path.dirname(__dirname), '.env.production');
if (fs.existsSync(envPath)) {
  config({ path: envPath });
}

const siteUrl = process.env.VITE_SITE_URL;

if (!siteUrl) {
  console.error('\n❌ ERROR: VITE_SITE_URL environment variable is not set!\n');
  console.error('Skipping URL replacement (this is okay for test deployments)\n');
  process.exit(0); // Don't fail the build
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

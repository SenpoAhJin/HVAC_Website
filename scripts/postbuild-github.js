/**
 * Post-build script for GitHub Pages deployment
 * - Copies index.html to 404.html for client-side routing
 * - Injects noindex meta tag
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

console.log('📦 GitHub Pages post-build processing...');

// 1. Copy index.html to 404.html for SPA routing
if (!fs.existsSync(indexPath)) {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}

fs.copyFileSync(indexPath, notFoundPath);
console.log('✅ Copied index.html to 404.html');

// 2. Inject noindex meta tag to both files
function injectNoindex(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  
  if (html.includes('name="robots"')) {
    console.log(`ℹ️  Noindex tag already present in ${path.basename(filePath)}`);
    return;
  }
  
  const noindexTag = '\n    <meta name="robots" content="noindex, nofollow" />';
  html = html.replace(
    /<meta charset="UTF-8" \/>/,
    '<meta charset="UTF-8" />' + noindexTag
  );
  
  fs.writeFileSync(filePath, html);
  console.log(`✅ Injected noindex to ${path.basename(filePath)}`);
}

injectNoindex(indexPath);
injectNoindex(notFoundPath);

console.log('✅ GitHub Pages build complete');

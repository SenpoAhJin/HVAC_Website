/**
 * Inject noindex meta tag for non-production deployments
 * Prevents test sites from competing with production in search results
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Check if noindex already exists
if (html.includes('name="robots"')) {
  console.log('ℹ️  Noindex tag already present');
  process.exit(0);
}

// Inject noindex meta tag after charset
const noindexTag = '\n    <meta name="robots" content="noindex, nofollow" />';
html = html.replace(
  /<meta charset="UTF-8" \/>/,
  '<meta charset="UTF-8" />' + noindexTag
);

fs.writeFileSync(indexPath, html);
console.log('✅ Injected noindex meta tag to dist/index.html');

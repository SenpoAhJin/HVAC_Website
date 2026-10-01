const playwright = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

// Simple static server
function startServer(dir, port) {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: dir,
      rewrites: [
        { source: '**', destination: '/index.html' }
      ]
    });
  });
  
  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

(async () => {
  const builds = [
    { name: 'GreenGeeks', dir: './deploy', port: 3001, basePath: '' },
    { name: 'Vercel', dir: './dist', port: 3002, basePath: '' }, // Vercel build reuses dist
    { name: 'GitHub Pages', dir: './dist', port: 3003, basePath: '/HVAC_Website' }
  ];
  
  const viewports = [
    { width: 390, height: 844, name: '390px' },
    { width: 1440, height: 900, name: '1440px' }
  ];
  
  const pages = ['/', '/about'];
  
  const screenshotsDir = path.join(__dirname, 'screenshots', 'builds');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  const browser = await playwright.chromium.launch();
  
  for (const build of builds) {
    console.log(`\n\n========== ${build.name} ==========`);
    
    if (!fs.existsSync(build.dir)) {
      console.error(`❌ ${build.dir} not found, skipping ${build.name}`);
      continue;
    }
    
    // Start server for this build
    const server = await startServer(build.dir, build.port);
    
    try {
      for (const viewport of viewports) {
        console.log(`\n--- ${viewport.name} ---`);
        
        const page = await browser.newPage({ 
          viewport: { width: viewport.width, height: viewport.height }
        });
        
        for (const pagePath of pages) {
          const url = `http://localhost:${build.port}${build.basePath}${pagePath}`;
          console.log(`Testing: ${url}`);
          
          const consoleLogs = [];
          const errors = [];
          
          page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
              consoleLogs.push(`${msg.type()}: ${msg.text()}`);
            }
          });
          
          page.on('pageerror', err => {
            errors.push(`PAGE ERROR: ${err.message}`);
          });
          
          page.on('requestfailed', req => {
            errors.push(`404: ${req.url()}`);
          });
          
          try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
            await page.waitForTimeout(2000);
            
            // Check what's visible
            const visible = await page.evaluate(() => {
              const hasContent = document.body.innerText.length > 100;
              const hasReact = document.querySelector('#root').children.length > 0;
              const title = document.title;
              const hasNav = !!document.querySelector('nav');
              const hasFooter = !!document.querySelector('footer');
              
              return { hasContent, hasReact, title, hasNav, hasFooter };
            });
            
            console.log(`  Title: ${visible.title}`);
            console.log(`  React rendered: ${visible.hasReact ? '✅' : '❌'}`);
            console.log(`  Nav present: ${visible.hasNav ? '✅' : '❌'}`);
            console.log(`  Footer present: ${visible.hasFooter ? '✅' : '❌'}`);
            console.log(`  Content visible: ${visible.hasContent ? '✅' : '❌'}`);
            
            if (errors.length > 0) {
              console.log(`  ⚠️  Errors (${errors.length}):`);
              errors.slice(0, 5).forEach(err => console.log(`     ${err}`));
            } else {
              console.log(`  ✅ No 404s or errors`);
            }
            
            // Take screenshot
            const pageSlug = pagePath.replace(/\//g, '_') || '_root';
            const filename = `${build.name.toLowerCase().replace(/\s/g, '-')}-${viewport.name}${pageSlug}.png`;
            await page.screenshot({ 
              path: path.join(screenshotsDir, filename),
              fullPage: false
            });
            console.log(`  📸 Screenshot: ${filename}`);
            
          } catch (error) {
            console.error(`  ❌ Failed to load: ${error.message}`);
          }
        }
        
        await page.close();
      }
    } finally {
      // Stop server
      server.close();
    }
  }
  
  await browser.close();
  console.log(`\n✅ All tests complete. Screenshots saved to screenshots/builds/`);
})();

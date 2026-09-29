// Simple test script to check routes
const http = require('http');

function testUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          contentLength: data.length,
          hasContent: data.includes('<div id="root">') && data.length > 1000
        });
      });
    }).on('error', err => {
      resolve({ url, error: err.message });
    });
  });
}

async function runTests() {
  const baseUrl = 'http://localhost:4173';
  const routes = [
    '/HVAC_Website/',
    '/HVAC_Website/services',
    '/HVAC_Website/about',
    '/HVAC_Website/contact'
  ];

  console.log('Testing GitHub Pages build (base: /HVAC_Website/):\n');
  
  for (const route of routes) {
    const result = await testUrl(baseUrl + route);
    console.log(`Route: ${route}`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Content Length: ${result.contentLength} bytes`);
    console.log(`  Has React Root: ${result.hasContent}`);
    console.log('');
  }
}

runTests().catch(console.error);

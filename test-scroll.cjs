const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Find Chrome installation
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
];

function findChrome() {
  for (const chromePath of CHROME_PATHS) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }
  throw new Error('Chrome not found. Please install Chrome.');
}

async function testScrollBehavior(url, label) {
  console.log(`\n=== Testing ${label}: ${url} ===\n`);
  
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: false,
    args: ['--window-size=1440,900']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  const results = [];
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  try {
    // Go to home page
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1000);
    
    // Scroll down on home page
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    let scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Home - After scrolling down: scrollY = ${scrollY}`);
    results.push({ page: 'Home', action: 'Scroll down', scrollY });
    
    // Click Services nav link
    await page.click('a[href="/services"]');
    await page.waitForTimeout(1000);
    
    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Services - After nav click: scrollY = ${scrollY}`);
    results.push({ page: 'Services', action: 'Nav click from Home', scrollY });
    await page.screenshot({ path: path.join(screenshotDir, `${label.replace(/\s+/g, '-')}-services.png`) });
    
    // Scroll down on Services
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    
    // Click About link
    await page.click('a[href="/about"]');
    await page.waitForTimeout(1000);
    
    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`About - After nav click: scrollY = ${scrollY}`);
    results.push({ page: 'About', action: 'Nav click from Services', scrollY });
    await page.screenshot({ path: path.join(screenshotDir, `${label.replace(/\s+/g, '-')}-about.png`) });
    
    // Scroll down on About
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    // Click Contact link
    await page.click('a[href="/contact"]');
    await page.waitForTimeout(1000);
    
    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Contact - After nav click: scrollY = ${scrollY}`);
    results.push({ page: 'Contact', action: 'Nav click from About', scrollY });
    await page.screenshot({ path: path.join(screenshotDir, `${label.replace(/\s+/g, '-')}-contact.png`) });
    
    // Test browser back button
    await page.goBack();
    await page.waitForTimeout(1000);
    
    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`About - After browser back: scrollY = ${scrollY}`);
    results.push({ page: 'About', action: 'Browser back', scrollY });
    
    // Test browser forward button
    await page.goForward();
    await page.waitForTimeout(1000);
    
    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Contact - After browser forward: scrollY = ${scrollY}`);
    results.push({ page: 'Contact', action: 'Browser forward', scrollY });
    
    // Test footer link
    await page.click('footer a[href="/services"]');
    await page.waitForTimeout(1000);
    
    scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Services - After footer link: scrollY = ${scrollY}`);
    results.push({ page: 'Services', action: 'Footer link click', scrollY });
    
    // Test 404 page
    await page.goto(`${url}/does-not-exist`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(1000);
    
    const notFoundVisible = await page.evaluate(() => {
      return document.body.textContent.includes('404');
    });
    console.log(`404 Page - Renders: ${notFoundVisible}`);
    results.push({ page: '404', action: 'Unknown URL', renders: notFoundVisible });
    await page.screenshot({ path: path.join(screenshotDir, `${label.replace(/\s+/g, '-')}-404.png`) });
    
  } catch (error) {
    console.error('Test error:', error);
  }
  
  await browser.close();
  
  // Check results
  console.log('\n=== RESULTS ===\n');
  const failures = results.filter(r => r.scrollY !== undefined && r.scrollY > 10);
  if (failures.length > 0) {
    console.log('FAILURES (scrollY should be 0):');
    failures.forEach(f => console.log(`  ${f.page} - ${f.action}: scrollY = ${f.scrollY}`));
  } else {
    console.log('All scroll tests PASSED (scrollY = 0 after navigation)');
  }
  
  return results;
}

async function main() {
  // Test preview build
  console.log('Starting preview server...');
  const { spawn } = require('child_process');
  const previewProcess = spawn('npm', ['run', 'preview'], {
    shell: true,
    cwd: __dirname
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    await testScrollBehavior('http://localhost:4173', 'Preview Build');
  } catch (error) {
    console.error('Preview test failed:', error);
  }
  
  previewProcess.kill();
  
  // Test live Vercel
  console.log('\n\n');
  try {
    await testScrollBehavior('https://premier-tech-solution.vercel.app', 'Live Vercel');
  } catch (error) {
    console.error('Vercel test failed:', error);
  }
}

main().catch(console.error);

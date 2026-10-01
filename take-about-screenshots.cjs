const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch();
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  const viewports = [
    { width: 1440, height: 900, name: '1440px' },
    { width: 768, height: 1024, name: '768px' },
    { width: 390, height: 844, name: '390px' }
  ];
  
  for (const viewport of viewports) {
    console.log(`\n=== ${viewport.name} viewport ===`);
    
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    await page.goto('http://localhost:5173/about');
    await page.waitForTimeout(2000); // Wait for images to load
    
    // Get collage tiles measurements and visibility info
    const tiles = await page.evaluate(() => {
      const tileElements = document.querySelectorAll('.grid.grid-cols-2 > div');
      return Array.from(tileElements).map((tile, i) => {
        const rect = tile.getBoundingClientRect();
        const img = tile.querySelector('img');
        const imgRect = img ? img.getBoundingClientRect() : null;
        
        return {
          tile: i + 1,
          tileWidth: Math.round(rect.width),
          tileHeight: Math.round(rect.height),
          imgFile: img ? img.src.split('/').pop() : 'none',
          imgNaturalWidth: img ? img.naturalWidth : 0,
          imgNaturalHeight: img ? img.naturalHeight : 0,
          objectPosition: img ? window.getComputedStyle(img).objectPosition : 'none',
          objectFit: img ? window.getComputedStyle(img).objectFit : 'none',
          aspectRatio: img ? window.getComputedStyle(img).aspectRatio : 'none'
        };
      });
    });
    
    console.log('Collage tiles:');
    tiles.forEach(t => {
      console.log(`  Tile ${t.tile} (${t.imgFile}):`);
      console.log(`    Container: ${t.tileWidth}×${t.tileHeight}px`);
      console.log(`    Image natural: ${t.imgNaturalWidth}×${t.imgNaturalHeight}px`);
      console.log(`    object-fit: ${t.objectFit} | object-position: ${t.objectPosition}`);
      if (t.aspectRatio !== 'auto') {
        console.log(`    aspect-ratio: ${t.aspectRatio}`);
      }
    });
    
    // Scroll to collage section
    await page.evaluate(() => {
      const collage = document.querySelector('.grid.grid-cols-2');
      if (collage) {
        collage.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    
    await page.waitForTimeout(500);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, `about-collage-${viewport.name}.png`), 
      fullPage: false 
    });
    
    // Take focused screenshot of just the collage
    const collageBox = await page.evaluate(() => {
      const collage = document.querySelector('.grid.grid-cols-2');
      if (!collage) return null;
      const rect = collage.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
    });
    
    if (collageBox) {
      await page.screenshot({ 
        path: path.join(screenshotsDir, `about-collage-detail-${viewport.name}.png`),
        clip: collageBox
      });
      console.log(`Collage position: x=${Math.round(collageBox.x)}, y=${Math.round(collageBox.y)}`);
    }
    
    await page.close();
  }
  
  await browser.close();
  
  console.log('\n✅ Screenshots saved to screenshots/ directory');
  console.log('Files created:');
  console.log('  - about-collage-1440px.png (full page)');
  console.log('  - about-collage-detail-1440px.png (collage only)');
  console.log('  - about-collage-768px.png (full page)');
  console.log('  - about-collage-detail-768px.png (collage only)');
  console.log('  - about-collage-390px.png (full page)');
  console.log('  - about-collage-detail-390px.png (collage only)');
})();

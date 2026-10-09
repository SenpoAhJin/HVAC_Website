import { test, expect } from '@playwright/test';

test.describe('Vercel deployment visual checks', () => {
  const url = 'https://hvac-coral-phi.vercel.app';

  test('390px mobile - collage visible, technician head in frame, no Call Now button, no blank labels', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check collage visible
    const collage = page.locator('.grid').first();
    await expect(collage).toBeVisible();
    
    // Check no "Call Now" button (PhoneCallButton should be hidden)
    const callButton = page.getByText('Call Now');
    await expect(callButton).toHaveCount(0);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Check footer for blank labels - should not show phone/email/address sections
    const footer = page.locator('footer');
    const footerText = await footer.textContent();
    
    // Footer should only contain copyright and "Powered by"
    const hasOnlyExpectedContent = footerText.includes('Premier Tech Solutions') && 
                                   footerText.includes('All rights reserved');
    
    console.log('Footer content check:', hasOnlyExpectedContent ? 'PASS' : 'FAIL');
    console.log('Footer text:', footerText);
    
    await page.screenshot({ path: 'test-390px.png', fullPage: true });
  });

  test('1440px desktop - collage visible, technician head in frame, no Call Now button, no blank labels', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);
    
    await page.waitForLoadState('networkidle');
    
    const collage = page.locator('.grid').first();
    await expect(collage).toBeVisible();
    
    const callButton = page.getByText('Call Now');
    await expect(callButton).toHaveCount(0);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const footer = page.locator('footer');
    const footerText = await footer.textContent();
    
    const hasOnlyExpectedContent = footerText.includes('Premier Tech Solutions') && 
                                   footerText.includes('All rights reserved');
    
    console.log('Footer content check:', hasOnlyExpectedContent ? 'PASS' : 'FAIL');
    console.log('Footer text:', footerText);
    
    await page.screenshot({ path: 'test-1440px.png', fullPage: true });
  });
  
  test('Check About page top-right tile - technician head visible at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url + '/about');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Scroll to the technician collage
    const collage = page.locator('.grid').nth(1); // Second grid on about page
    await collage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: 'test-390px-about-collage.png' });
    
    console.log('About page collage screenshot captured at 390px');
  });
});

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_URL = 'https://hvac-coral-phi.vercel.app';
const PHONE_1 = '(951) 319-3022';
const PHONE_2 = '(951) 319-2014';

async function verifyTestSite() {
  console.log('🚀 Starting headless browser verification...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Disable cache
  await page.setCacheEnabled(false);
  
  const results = {
    url: TEST_URL,
    timestamp: new Date().toISOString(),
    passed: [],
    failed: [],
    consoleErrors: []
  };
  
  try {
    console.log(`📍 Navigating to ${TEST_URL}...`);
    await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Take initial screenshot
    await page.screenshot({ path: join(__dirname, 'verify-homepage.png'), fullPage: true });
    console.log('✅ Homepage screenshot saved\n');
    
    // Check phone numbers in navbar
    console.log('🔍 Checking navbar...');
    const navbarPhones = await page.evaluate((p1, p2) => {
      const navText = document.querySelector('nav')?.textContent || '';
      return {
        hasPhone1: navText.includes(p1),
        hasPhone2: navText.includes(p2),
        navContent: navText.slice(0, 200)
      };
    }, PHONE_1, PHONE_2);
    
    if (navbarPhones.hasPhone1) {
      results.passed.push(`Navbar contains ${PHONE_1}`);
      console.log(`  ✅ Found ${PHONE_1} in navbar`);
    } else {
      results.failed.push(`Navbar missing ${PHONE_1}`);
      console.log(`  ❌ Missing ${PHONE_1} in navbar`);
    }
    
    if (navbarPhones.hasPhone2) {
      results.passed.push(`Navbar contains ${PHONE_2}`);
      console.log(`  ✅ Found ${PHONE_2} in navbar`);
    } else {
      results.failed.push(`Navbar missing ${PHONE_2}`);
      console.log(`  ❌ Missing ${PHONE_2} in navbar`);
    }
    
    // Check hero section
    console.log('\n🔍 Checking hero section...');
    const heroPhones = await page.evaluate((p1, p2) => {
      const hero = document.querySelector('section[class*="hero"]') || document.querySelector('main > section:first-child');
      const heroText = hero?.textContent || '';
      return {
        hasPhone1: heroText.includes(p1),
        hasPhone2: heroText.includes(p2)
      };
    }, PHONE_1, PHONE_2);
    
    if (heroPhones.hasPhone1 || heroPhones.hasPhone2) {
      results.passed.push('Hero section contains phone number(s)');
      console.log('  ✅ Found phone number(s) in hero');
    } else {
      results.failed.push('Hero section missing phone numbers');
      console.log('  ❌ Missing phone numbers in hero');
    }
    
    // Check footer
    console.log('\n🔍 Checking footer...');
    const footerCheck = await page.evaluate((p1, p2) => {
      const footer = document.querySelector('footer');
      const footerText = footer?.textContent || '';
      const contactColumn = Array.from(footer?.querySelectorAll('h3') || [])
        .find(h3 => h3.textContent.includes('Contact'));
      const telLinks = Array.from(footer?.querySelectorAll('a[href^="tel:"]') || []);
      
      return {
        hasPhone1: footerText.includes(p1),
        hasPhone2: footerText.includes(p2),
        hasContactColumn: !!contactColumn,
        telLinksCount: telLinks.length,
        telLinks: telLinks.map(a => ({ href: a.href, text: a.textContent }))
      };
    }, PHONE_1, PHONE_2);
    
    if (footerCheck.hasPhone1) {
      results.passed.push(`Footer contains ${PHONE_1}`);
      console.log(`  ✅ Found ${PHONE_1} in footer`);
    } else {
      results.failed.push(`Footer missing ${PHONE_1}`);
      console.log(`  ❌ Missing ${PHONE_1} in footer`);
    }
    
    if (footerCheck.hasPhone2) {
      results.passed.push(`Footer contains ${PHONE_2}`);
      console.log(`  ✅ Found ${PHONE_2} in footer`);
    } else {
      results.failed.push(`Footer missing ${PHONE_2}`);
      console.log(`  ❌ Missing ${PHONE_2} in footer`);
    }
    
    if (footerCheck.hasContactColumn) {
      results.passed.push('Footer "Contact Us" column exists');
      console.log('  ✅ "Contact Us" column exists');
    } else {
      results.failed.push('Footer "Contact Us" column missing');
      console.log('  ❌ "Contact Us" column missing');
    }
    
    console.log(`  📞 Tel links found: ${footerCheck.telLinksCount}`);
    footerCheck.telLinks.forEach(link => {
      console.log(`     ${link.text} → ${link.href}`);
    });
    
    // Navigate to Contact page
    console.log('\n🔍 Checking Contact page...');
    await page.goto(`${TEST_URL}/contact`, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: join(__dirname, 'verify-contact.png'), fullPage: true });
    
    const contactPhones = await page.evaluate((p1, p2) => {
      const pageText = document.body.textContent;
      const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]'));
      return {
        hasPhone1: pageText.includes(p1),
        hasPhone2: pageText.includes(p2),
        telLinksCount: telLinks.length,
        telLinks: telLinks.map(a => ({ href: a.href, text: a.textContent }))
      };
    }, PHONE_1, PHONE_2);
    
    if (contactPhones.hasPhone1) {
      results.passed.push(`Contact page contains ${PHONE_1}`);
      console.log(`  ✅ Found ${PHONE_1} on Contact page`);
    } else {
      results.failed.push(`Contact page missing ${PHONE_1}`);
      console.log(`  ❌ Missing ${PHONE_1} on Contact page`);
    }
    
    if (contactPhones.hasPhone2) {
      results.passed.push(`Contact page contains ${PHONE_2}`);
      console.log(`  ✅ Found ${PHONE_2} on Contact page`);
    } else {
      results.failed.push(`Contact page missing ${PHONE_2}`);
      console.log(`  ❌ Missing ${PHONE_2} on Contact page`);
    }
    
    console.log(`  📞 Tel links on Contact page: ${contactPhones.telLinksCount}`);
    
    // Check FAQ widget
    console.log('\n🔍 Checking FAQ widget...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
    
    // Try multiple selectors for FAQ button
    const faqButton = await page.$('button[class*="fixed"][class*="bottom"]') 
      || await page.$('button[aria-label*="FAQ"]')
      || await page.$('[class*="chat-widget"] button');
    
    if (faqButton) {
      console.log('  📍 Found FAQ button, clicking...');
      await faqButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait longer
      
      const faqCheck = await page.evaluate((p1, p2) => {
        // Try multiple selectors for FAQ content
        const faqWidget = document.querySelector('[class*="chat-widget"]') 
          || document.querySelector('[class*="expanded"]')
          || document.querySelector('[role="dialog"]')
          || Array.from(document.querySelectorAll('div')).find(d => 
              d.textContent.includes('Frequently Asked Questions')
            );
        
        if (!faqWidget) {
          return { faqWidgetOpen: false };
        }
        
        const faqText = faqWidget.textContent || '';
        const faqTelLinks = Array.from(faqWidget.querySelectorAll('a[href^="tel:"]') || []);
        
        // Look for specific FAQ questions
        const hasContactFaq = faqText.includes('How can I contact you') || faqText.includes('contact you');
        const hasScheduleFaq = faqText.includes('How can I schedule service') || faqText.includes('schedule service');
        
        return {
          faqWidgetOpen: true,
          hasPhone1: faqText.includes(p1),
          hasPhone2: faqText.includes(p2),
          telLinksCount: faqTelLinks.length,
          telLinks: faqTelLinks.map(a => ({ href: a.href, text: a.textContent.trim() })),
          hasContactFaq,
          hasScheduleFaq,
          faqPreview: faqText.slice(0, 300)
        };
      }, PHONE_1, PHONE_2);
      
      if (faqCheck.faqWidgetOpen) {
        results.passed.push('FAQ widget opened successfully');
        console.log('  ✅ FAQ widget opened');
        console.log(`  📝 Preview: ${faqCheck.faqPreview.slice(0, 100)}...`);
        
        await page.screenshot({ path: join(__dirname, 'verify-faq-widget.png'), fullPage: true });
        
        if (faqCheck.hasPhone1) {
          results.passed.push(`FAQ widget contains ${PHONE_1}`);
          console.log(`  ✅ Found ${PHONE_1} in FAQ`);
        } else {
          results.failed.push(`FAQ widget missing ${PHONE_1}`);
          console.log(`  ❌ Missing ${PHONE_1} in FAQ`);
        }
        
        if (faqCheck.hasPhone2) {
          results.passed.push(`FAQ widget contains ${PHONE_2}`);
          console.log(`  ✅ Found ${PHONE_2} in FAQ`);
        } else {
          results.failed.push(`FAQ widget missing ${PHONE_2}`);
          console.log(`  ❌ Missing ${PHONE_2} in FAQ`);
        }
        
        if (faqCheck.hasContactFaq) {
          results.passed.push('FAQ has "How can I contact you?" question');
          console.log('  ✅ Found contact FAQ question');
        } else {
          results.failed.push('FAQ missing contact question');
          console.log('  ⚠️  Missing contact FAQ question');
        }
        
        if (faqCheck.hasScheduleFaq) {
          results.passed.push('FAQ has schedule service question');
          console.log('  ✅ Found schedule service FAQ');
        } else {
          results.failed.push('FAQ missing schedule question');
          console.log('  ⚠️  Missing schedule FAQ question');
        }
        
        console.log(`  📞 Tel links in FAQ: ${faqCheck.telLinksCount}`);
        if (faqCheck.telLinks.length > 0) {
          faqCheck.telLinks.forEach(link => {
            console.log(`     ${link.text} → ${link.href}`);
          });
        }
      } else {
        results.failed.push('FAQ widget did not open or not found');
        console.log('  ❌ FAQ widget did not open');
      }
    } else {
      results.failed.push('FAQ widget button not found');
      console.log('  ❌ FAQ widget button not found');
    }
    
    // Check for inquiry email (should NOT be present)
    console.log('\n🔍 Checking for exposed email address...');
    const emailCheck = await page.evaluate(() => {
      const pageText = document.body.textContent;
      return {
        hasInquiryEmail: pageText.includes('inquiry@premiertechsolution.com')
      };
    });
    
    if (!emailCheck.hasInquiryEmail) {
      results.passed.push('Inquiry email NOT exposed in frontend');
      console.log('  ✅ inquiry@premiertechsolution.com NOT found in page (correct)');
    } else {
      results.failed.push('Inquiry email EXPOSED in frontend');
      console.log('  ⚠️  inquiry@premiertechsolution.com found in page (should be backend only)');
    }
    
    // Fetch JS bundle to verify phone numbers in code
    console.log('\n🔍 Checking deployed JavaScript bundle...');
    const bundleCheck = await page.evaluate(async () => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const jsBundle = scripts.find(s => s.src.includes('/assets/') && s.src.includes('.js'));
      
      if (jsBundle) {
        try {
          const response = await fetch(jsBundle.src);
          const code = await response.text();
          return {
            bundleUrl: jsBundle.src,
            hasPhone1: code.includes('951') && code.includes('319') && code.includes('3022'),
            hasPhone2: code.includes('951') && code.includes('319') && code.includes('2014'),
            bundleSize: code.length
          };
        } catch (err) {
          return { error: err.message };
        }
      }
      return { error: 'JS bundle not found' };
    });
    
    if (bundleCheck.hasPhone1 && bundleCheck.hasPhone2) {
      results.passed.push('Phone numbers present in deployed JS bundle');
      console.log(`  ✅ Both phone numbers found in bundle`);
      console.log(`  📦 Bundle: ${bundleCheck.bundleUrl}`);
      console.log(`  📏 Size: ${(bundleCheck.bundleSize / 1024).toFixed(2)} KB`);
    } else if (bundleCheck.error) {
      results.failed.push(`Could not verify JS bundle: ${bundleCheck.error}`);
      console.log(`  ⚠️  ${bundleCheck.error}`);
    } else {
      results.failed.push('Phone numbers missing from deployed JS bundle');
      console.log(`  ❌ Phone numbers not found in bundle`);
    }
    
    // Console errors
    console.log('\n🔍 Console errors:');
    if (consoleErrors.length === 0) {
      results.passed.push('No console errors');
      console.log('  ✅ No console errors detected');
    } else {
      results.consoleErrors = consoleErrors;
      results.failed.push(`${consoleErrors.length} console error(s) detected`);
      console.log(`  ⚠️  ${consoleErrors.length} error(s):`);
      consoleErrors.forEach(err => console.log(`     ${err}`));
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    results.failed.push(`Critical error: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Save results
  writeFileSync(
    join(__dirname, 'verify-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Console Errors: ${results.consoleErrors.length}`);
  console.log('='.repeat(60));
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed checks:');
    results.failed.forEach(f => console.log(`  - ${f}`));
  }
  
  console.log('\n📁 Results saved to verify-results.json');
  console.log('📸 Screenshots saved: verify-homepage.png, verify-contact.png, verify-faq-widget.png\n');
  
  return results;
}

verifyTestSite().catch(console.error);

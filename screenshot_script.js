const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--use-gl=swiftshader',
        '--enable-webgl',
        '--enable-accelerated-2d-canvas'
      ]
    });
    const context = await browser.newContext({ 
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
  
  // Navigate to the page
  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Wait for page to load
  console.log('Waiting for page to load...');
  await page.waitForTimeout(5000);
  
  // Check for errors
  const bodyText = await page.textContent('body');
  console.log('Page loaded. Looking for elements...');
  
  // Scroll down slowly to let content load
  console.log('Scrolling down...');
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(2000);
  
  // Try to find the Servicios section
  const serviciosExists = await page.locator('.SliceHomeArtists').count() > 0;
  console.log('Servicios section found:', serviciosExists);
  
  if (serviciosExists) {
    // Scroll to Servicios section
    console.log('Scrolling to Servicios section...');
    await page.evaluate(() => {
      const serviciosSection = document.querySelector('.SliceHomeArtists');
      if (serviciosSection) {
        serviciosSection.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Find and hover/click on "IA Aplicada"
    console.log('Looking for IA Aplicada link...');
    
    // Try different selectors
    const iaAplicadaLink = await page.locator('a:has-text("IA Aplicada")').first();
    
    if (await iaAplicadaLink.count() > 0) {
      console.log('Found IA Aplicada, hovering over it...');
      await iaAplicadaLink.hover();
      await page.waitForTimeout(2000);
      
      console.log('Setting active...');
      await page.evaluate(() => {
        const links = document.querySelectorAll('.SliceHomeArtists-listItem');
        links.forEach((link, index) => {
          if (link.textContent.includes('IA Aplicada')) {
            const event = new MouseEvent('mouseenter', { bubbles: true });
            link.dispatchEvent(event);
          }
        });
      });
      await page.waitForTimeout(3000);
    } else {
      console.log('IA Aplicada not found with first selector, trying alternative...');
      
      // List all service links
      const allLinks = await page.locator('.SliceHomeArtists-listItem').allTextContents();
      console.log('Found service links:', allLinks);
    }
  }
  
  // Take screenshot
  const screenshotPath = '/Users/alvarogarciapelayoportero/kometa2/spline_screenshot.png';
  console.log(`Taking screenshot and saving to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  
  console.log('Screenshot saved successfully!');
  
  await browser.close();
  } catch (error) {
    console.error('Error:', error);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
})();

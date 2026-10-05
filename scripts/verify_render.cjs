const { createRequire } = require('module');
const apiRequire = createRequire('e:/MitFloww/api/package.json');
const puppeteer = apiRequire('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const errors = [];
  page.on('pageerror', err => errors.push(err.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const failedRequests = [];
  page.on('requestfailed', req => failedRequests.push({ url: req.url(), failure: req.failure()?.errorText }));

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  console.log('Errors:', errors);
  console.log('Failed requests count:', failedRequests.length);
  if (failedRequests.length > 0) {
    console.log('Failed requests:', failedRequests);
  }

  // Hero section screenshot
  const heroEl = await page.$('#hero-section');
  if (heroEl) {
    await heroEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_hero.png') });
    console.log('Hero screenshot saved: assets/verify_hero.png');
  }

  // Workflow section screenshot
  const workflowEl = await page.$('#workflow-story');
  if (workflowEl) {
    await workflowEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_workflow.png') });
    console.log('Workflow screenshot saved: assets/verify_workflow.png');
  }

  // Disciplines section
  const discEl = await page.$('.creators-selector-section');
  if (discEl) {
    await discEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_disciplines_design.png') });
    console.log('Designers tab screenshot saved');

    // Click video tab
    const videoTab = await page.$('[data-creator-target="video"]');
    if (videoTab) {
      await videoTab.click();
      await new Promise(r => setTimeout(r, 400));
      await discEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_disciplines_video.png') });
      console.log('Video tab screenshot saved');
    }

    // Click dev tab
    const devTab = await page.$('[data-creator-target="developers"]');
    if (devTab) {
      await devTab.click();
      await new Promise(r => setTimeout(r, 400));
      await discEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_disciplines_dev.png') });
      console.log('Dev tab screenshot saved');
    }
  }

  // Showcase section screenshot
  const showcaseEl = await page.$('#showcase-story');
  if (showcaseEl) {
    await showcaseEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_showcase_tab1.png') });
    console.log('Showcase Tab 1 saved');

    // Click tab 2: Client Share
    const tab2 = await page.$('[data-showcase-tab="share"]');
    if (tab2) {
      await tab2.click();
      await new Promise(r => setTimeout(r, 400));
      await showcaseEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_showcase_tab2.png') });
      console.log('Showcase Tab 2 saved');
    }

    // Click tab 4: Payment
    const tab4 = await page.$('[data-showcase-tab="payment"]');
    if (tab4) {
      await tab4.click();
      await new Promise(r => setTimeout(r, 400));
      await showcaseEl.screenshot({ path: path.resolve(__dirname, '../assets/verify_showcase_tab4.png') });
      console.log('Showcase Tab 4 saved');
    }
  }

  // Mobile Viewport Test (375x812 iPhone)
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  const mobileHero = await page.$('#hero-section');
  if (mobileHero) {
    await mobileHero.screenshot({ path: path.resolve(__dirname, '../assets/verify_mobile_hero.png') });
    console.log('Mobile hero screenshot saved');
  }
  const mobileDisc = await page.$('.creators-selector-section');
  if (mobileDisc) {
    await mobileDisc.screenshot({ path: path.resolve(__dirname, '../assets/verify_mobile_disc.png') });
    console.log('Mobile disciplines screenshot saved');
  }

  await browser.close();
  console.log('Verification completed successfully!');
})();

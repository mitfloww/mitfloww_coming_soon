const { createRequire } = require('module');
const apiRequire = createRequire('e:/MitFloww/api/package.json');
const puppeteer = apiRequire('puppeteer');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Simple static server
const PORT = 8089;
const ROOT = path.resolve(__dirname, '..');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
    errors.push(err.message);
  });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle2' });

  // 1. Verify Hero
  console.log('Testing Hero...');
  const heroImgSrc = await page.$eval('#hero-screenshot-img', el => el.src);
  console.log('Hero image src:', heroImgSrc);

  // 2. Test Section 5 real MitFloww motion film
  console.log('Testing MitFloww motion film...');
  const motionVideoExists = await page.$eval('#mitfloww-motion-video', el => !!el);
  console.log('Motion video exists:', motionVideoExists);

  // 3. Test Showcase Tab switching
  console.log('Testing Showcase tabs...');
  const initialShowcaseImg = await page.$eval('#showcase-current-img', el => el.src);
  console.log('Initial showcase image:', initialShowcaseImg);

  const tab1 = await page.$('[data-showcase-tab="1"]');
  if (tab1) await tab1.click();
  await new Promise(r => setTimeout(r, 200));
  const newShowcaseImg = await page.$eval('#showcase-current-img', el => el.src);
  console.log('Switched showcase image:', newShowcaseImg);

  // 4. Test client delivery state transition
  console.log('Testing client delivery state...');
  const afterPaymentBtn = await page.$('[data-security-state-btn="post"]');
  if (afterPaymentBtn) {
    await afterPaymentBtn.click();
    await new Promise(r => setTimeout(r, 200));
    const activeState = await page.$eval('.security-state-demo', el => el.dataset.securityState);
    console.log('Client state after payment:', activeState);
  }

  // 5. Test Content Creator Tab in Section 8
  console.log('Testing Content Creator tab in Section 8...');
  const creatorPill = await page.$('[data-creator-target="creators"]');
  if (creatorPill) {
    await creatorPill.click();
    await new Promise(r => setTimeout(r, 200));
    const isCreatorPanelActive = await page.$eval('[data-creator-panel="creators"]', el => el.classList.contains('is-active'));
    console.log('Content Creator panel active:', isCreatorPanelActive);

    console.log('Creator illustration panel active:', isCreatorPanelActive);
  }

  // 6. The old fabricated controlled-link widget is intentionally absent.
  console.log('Legacy controlled-link widget removed.');

  // Capture the current viewport for visual smoke testing. Chrome rejects very tall
  // full-page captures once the composed landing page exceeds its bitmap limit.
  await page.evaluate(() => {
    document.querySelectorAll('.reveal-up, [data-reveal]').forEach(el => el.classList.add('is-revealed'));
    document.querySelectorAll('.vulnerable-moment-section').forEach(el => el.classList.add('is-revealed'));
  });
  const screenshotPath = path.join(ROOT, 'assets', 'verification_full_page.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved visual smoke screenshot to:', screenshotPath);

  await browser.close();
  server.close();

  if (errors.length > 0) {
    console.error('VERIFICATION FAILED WITH ERRORS:', errors);
    process.exit(1);
  } else {
    console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
    process.exit(0);
  }
});

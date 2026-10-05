const { createRequire } = require('module');
const apiRequire = createRequire('e:/MitFloww/api/package.json');
const puppeteer = apiRequire('puppeteer');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 8091;
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
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end(); return; }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle2' });

  async function captureSection(selector, outputPath) {
    const element = await page.$(selector);
    if (!element) return;
    await element.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 450));
    await element.screenshot({ path: outputPath });
  }

  // 1. Hero
  await captureSection('#hero-section', path.join(ROOT, 'assets', 'section_hero.png'));

  // 2. Vulnerable Moment
  await captureSection('.vulnerable-moment-section', path.join(ROOT, 'assets', 'section_vulnerable.png'));

  // 3. Motion Graphics (Section 5)
  await captureSection('.cinematic-video-section', path.join(ROOT, 'assets', 'section_motion.png'));

  // 4. Showcase (Section 6)
  await captureSection('#showcase-story', path.join(ROOT, 'assets', 'section_showcase.png'));

  // 5. Capabilities (Section 7)
  await captureSection('#capabilities', path.join(ROOT, 'assets', 'section_capabilities.png'));

  // 6. Disciplines (Section 8) - Content Creators
  const creatorsPill = await page.$('[data-creator-target="creators"]');
  if (creatorsPill) await creatorsPill.click();
  await new Promise(r => setTimeout(r, 200));
  await captureSection('.creators-selector-section', path.join(ROOT, 'assets', 'section_creators.png'));

  // 7. Security architecture and restored 01-04 pipeline
  await captureSection('#security', path.join(ROOT, 'assets', 'section_security.png'));

  const postState = await page.$('[data-security-state-btn="post"]');
  if (postState) await postState.click();
  await new Promise(r => setTimeout(r, 250));
  await captureSection('.security-state-demo', path.join(ROOT, 'assets', 'section_security_post.png'));
  await captureSection('.secure-delivery-product-shot', path.join(ROOT, 'assets', 'section_secure_delivery.png'));

  console.log('Section screenshots captured successfully!');
  await browser.close();
  server.close();
});

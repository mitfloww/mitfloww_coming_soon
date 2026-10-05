const { createRequire } = require('module');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const apiRequire = createRequire('E:/MitFloww/api/package.json');
const puppeteer = apiRequire('puppeteer');

const SESSION_SECRET = "14a7761c2897d2af29a5779894779fa7f12d6154d1d88273a2608a40a9011c02";
const USER_ID = "f58ed04e-e049-4645-9f26-3d691a36ffbb";

function createSessionToken(userId) {
  const now = Date.now();
  const payload = Buffer.from(JSON.stringify({
    userId,
    iat: now,
    exp: now + 30 * 24 * 60 * 60 * 1000
  })).toString('base64url');
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${hmac}`;
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  const sessionToken = createSessionToken(USER_ID);

  await page.setCookie({
    name: 'mitfloww_session',
    value: sessionToken,
    domain: 'localhost',
    path: '/'
  });

  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('mitfloww-theme', 'light');
      localStorage.setItem('theme', 'light');
    } catch (e) {}
  });

  console.log('Navigating to user file review page...');
  await page.goto('http://localhost:3000/projects/quality-marketing-1-2/files/d62ca80a-0c20-462b-86d6-c224738e9a3e', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2500));

  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });

  // Find the revision section / card
  const revisionCardHandle = await page.evaluateHandle(() => {
    const titles = Array.from(document.querySelectorAll('p'));
    const revTitle = titles.find(el => el.textContent && el.textContent.trim().toUpperCase() === 'REVISIONS');
    if (revTitle) {
      // Find parent section or card
      let p = revTitle;
      while (p && !p.className.includes('border') && p.parentElement) {
        p = p.parentElement;
      }
      return p || revTitle.closest('section') || revTitle.parentElement;
    }
    return null;
  });

  if (revisionCardHandle) {
    const box = await revisionCardHandle.boundingBox();
    console.log('Revision card bounding box:', box);
    if (box) {
      await page.screenshot({
        path: 'E:/MitFloww/mitfloww_coming_soon/assets/test_revision_card_real.png',
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: box.width + 20,
          height: box.height + 20
        }
      });
      console.log('Saved test_revision_card_real.png');
    }
  } else {
    console.warn('Could not find revision card handle!');
    await page.screenshot({ path: 'E:/MitFloww/mitfloww_coming_soon/assets/test_full_page.png' });
  }

  await browser.close();
}

run().catch(console.error);

const { createRequire } = require('module');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const apiRequire = createRequire('e:/MitFloww/api/package.json');
const puppeteer = apiRequire('puppeteer');

const SESSION_SECRET = "14a7761c2897d2af29a5779894779fa7f12d6154d1d88273a2608a40a9011c02";
const USER_ID = "f58ed04e-e049-4645-9f26-3d691a36ffbb"; // maheshp7304@gmail.com
const CLIENT_EMAIL = "macdevilgames@gmail.com";

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

  const sessionToken = createSessionToken(USER_ID);
  console.log('Session token generated:', sessionToken);

  // 1. Capture User File Review
  {
    console.log('Opening User File Review...');
    const page = await browser.newPage();
    await page.setCookie({
      name: 'mitfloww_session',
      value: sessionToken,
      domain: 'localhost',
      path: '/'
    });

    await page.goto('http://localhost:3000/projects/quality-marketing-1-2/files/d62ca80a-0c20-462b-86d6-c224738e9a3e', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_user_review.png' });
    console.log('Saved real_user_review.png');

    // 2. Open Share Modal on same page
    console.log('Looking for Share button...');
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const shareBtn = btns.find(b => b.textContent.includes('Share'));
      if (shareBtn) {
        shareBtn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log('Clicked share button! Waiting for modal...');
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_user_share_modal.png' });
      console.log('Saved real_user_share_modal.png');
    } else {
      console.log('Could not find share button');
    }

    // Also capture Projects List Dashboard
    console.log('Opening Projects List Dashboard...');
    await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_dashboard.png' });
    console.log('Saved real_dashboard.png');
    await page.close();
  }

  // 3. Client File Review with Watermark
  {
    console.log('Opening Client File Review...');
    const page = await browser.newPage();
    const clientUrl = 'http://localhost:3000/s/eyJlIjoxNzkxMjU4OTIyLCJuIjoiQloxcXNEdGNIelhGR0NIMGlRN2VIU29BIn0.jYeMFidmAmgxhtiQBBIkeHVtO5cGySAi3DhHFwMb4Y8/files/d62ca80a-0c20-462b-86d6-c224738e9a3e';
    await page.goto(clientUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Check if access gate email input is present
    const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    if (emailInput) {
      console.log('Entering client email for review...');
      await emailInput.type(CLIENT_EMAIL);
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 5000));
    }
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_client_review.png' });
    console.log('Saved real_client_review.png');
    await page.close();
  }

  // 4. Client Paid Project Success
  {
    console.log('Opening Client Paid Project...');
    const page = await browser.newPage();
    const paidUrl = 'http://localhost:3000/s/eyJlIjoxNzkxMjYwNTMyLCJuIjoib1cyOVVqR2h3U0dwYWNqWFZ4V0w5c2tmIn0.G2ZoL4ECmDefL3zgOLK9ICR7Rd6p25a3_-lZ7jmBRWw/payment/success';
    await page.goto(paidUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    if (emailInput) {
      console.log('Entering client email for paid project...');
      await emailInput.type(CLIENT_EMAIL);
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 5000));
    }
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_client_paid.png' });
    console.log('Saved real_client_paid.png');
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});

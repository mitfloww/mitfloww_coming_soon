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

  async function setupLightPage() {
    const page = await browser.newPage();
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
    return page;
  }

  // 1. Projects Page (Light Theme)
  {
    console.log('Capturing Projects Page in Light Theme...');
    const page = await setupLightPage();
    await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_light_projects.png' });
    console.log('Saved real_light_projects.png');
    await page.close();
  }

  // 2. Dashboard Page (Light Theme)
  {
    console.log('Capturing Dashboard Page in Light Theme...');
    const page = await setupLightPage();
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_light_dashboard.png' });
    console.log('Saved real_light_dashboard.png');
    await page.close();
  }

  // 3. User File Review - Scrolled down to show comment section clearly
  {
    console.log('Capturing User File Review (Scrolled to Comments) in Light Theme...');
    const page = await setupLightPage();
    await page.goto('http://localhost:3000/projects/quality-marketing-1-2/files/d62ca80a-0c20-462b-86d6-c224738e9a3e', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      // Scroll review container / main down to reveal the comment section
      window.scrollTo(0, 180);
      const scrollable = document.querySelector('main') || document.querySelector('.overflow-y-auto');
      if (scrollable) scrollable.scrollTop = 200;
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_light_user_review_scrolled.png' });
    console.log('Saved real_light_user_review_scrolled.png');

    // Also capture Share Modal from this page
    console.log('Opening Share Modal in Light Theme...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const shareBtn = btns.find(b => b.textContent && b.textContent.includes('Share'));
      if (shareBtn) shareBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_light_user_share_modal.png' });
    console.log('Saved real_light_user_share_modal.png');
    await page.close();
  }

  // 4. Client Review (Light Theme)
  {
    console.log('Capturing Client Review in Light Theme...');
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.evaluateOnNewDocument(() => {
      try {
        localStorage.setItem('mitfloww-theme', 'light');
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    });

    const clientUrl = 'http://localhost:3000/s/eyJlIjoxNzkxMjU4OTIyLCJuIjoiQloxcXNEdGNIelhGR0NIMGlRN2VIU29BIn0.jYeMFidmAmgxhtiQBBIkeHVtO5cGySAi3DhHFwMb4Y8/files/d62ca80a-0c20-462b-86d6-c224738e9a3e';
    await page.goto(clientUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    if (emailInput) {
      console.log('Entering client email for review...');
      await emailInput.type(CLIENT_EMAIL);
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 5000));
    }

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_light_client_review.png' });
    console.log('Saved real_light_client_review.png');
    await page.close();
  }

  // 5. Client Paid / Payment Success (Light Theme)
  {
    console.log('Capturing Client Payment Success in Light Theme...');
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.evaluateOnNewDocument(() => {
      try {
        localStorage.setItem('mitfloww-theme', 'light');
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    });

    const paymentUrl = 'http://localhost:3000/s/eyJlIjoxNzkxMjYwNTMyLCJuIjoib1cyOVVqR2h3U0dwYWNqWFZ4V0w5c2tmIn0.G2ZoL4ECmDefL3zgOLK9ICR7Rd6p25a3_-lZ7jmBRWw/payment/success';
    await page.goto(paymentUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    if (emailInput) {
      console.log('Entering client email for payment success...');
      await emailInput.type(CLIENT_EMAIL);
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 5000));
    }

    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'e:/MitFloww/mitfloww_coming_soon/assets/real_light_client_paid.png' });
    console.log('Saved real_light_client_paid.png');
    await page.close();
  }

  await browser.close();
  console.log('All Light Theme Screenshots Captured Successfully!');
}

run().catch(err => {
  console.error('Error capturing light theme screenshots:', err);
  process.exit(1);
});

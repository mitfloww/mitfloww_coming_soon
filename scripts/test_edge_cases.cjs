const { createRequire } = require('module');
const path = require('path');
const fs = require('fs');

const apiRequire = createRequire('E:/MitFloww/api/package.json');
const puppeteer = apiRequire('puppeteer');

// Function representing the exact segment radius logic in file-review-shared.tsx:
function renderProgressBar(includedCount, usedCount) {
  if (includedCount <= 0) {
    return `<div style="height: 10px; width: 100%; border-radius: 9999px; background-color: #e8e9f4; transition: background-color 0.2s;"></div>`;
  }

  const segments = [];
  for (let index = 0; index < includedCount; index++) {
    const isSingle = includedCount === 1;
    const isFirst = index === 0;
    const isLast = index === includedCount - 1;

    const borderRadiusStyle = isSingle
      ? "9999px"
      : isFirst
        ? "9999px 0 0 9999px"
        : isLast
          ? "0 9999px 9999px 0"
          : "0";

    const bgColor = index < Math.min(usedCount, includedCount) ? "#005bdd" : "#e8e9f4";

    segments.push(
      `<div style="height: 10px; min-width: 0; flex: 1; border-radius: ${borderRadiusStyle}; background-color: ${bgColor}; transition: background-color 0.2s;"></div>`
    );
  }

  return `<div style="display: flex; width: 100%; align-items: center; gap: 2px;">${segments.join('')}</div>`;
}

function renderCard(title, badgeLeft, badgeRight, includedCount, usedCount) {
  return `
    <div style="background: #ffffff; border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 16px; padding: 14px 16px; width: 320px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: #0f172a;">REVISIONS</span>
        <div style="display: flex; gap: 6px;">
          <span style="background: #eef2ff; color: #1e1b4b; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px;">${badgeLeft}</span>
          <span style="background: #f1f5f9; color: #64748b; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 6px;">${badgeRight}</span>
        </div>
      </div>
      ${renderProgressBar(includedCount, usedCount)}
      <div style="margin-top: 8px; font-size: 10px; color: #94a3b8; font-weight: 500;">${title}</div>
    </div>
  `;
}

const testCases = [
  { title: "Edge Case: 0 Revisions (Disabled)", badgeLeft: "Disabled", badgeRight: "+₹0 / extra", included: 0, used: 0 },
  { title: "Edge Case: 1 Revision (0 used)", badgeLeft: "1 of 1 Left", badgeRight: "+₹0 / extra", included: 1, used: 0 },
  { title: "Edge Case: 1 Revision (1 used / Maxed)", badgeLeft: "0 of 1 Left", badgeRight: "+₹0 / extra", included: 1, used: 1 },
  { title: "Edge Case: 2 Revisions (1 used)", badgeLeft: "1 of 2 Left", badgeRight: "+₹0 / extra", included: 2, used: 1 },
  { title: "Edge Case: 3 Revisions (2 used)", badgeLeft: "1 of 3 Left", badgeRight: "+₹0 / extra", included: 3, used: 2 },
  { title: "Edge Case: 4 Revisions (2 used - Figma proportion)", badgeLeft: "2 of 4 Left", badgeRight: "+₹0 / extra", included: 4, used: 2 },
  { title: "12 Revisions (Partially used: 2 used, 10 left)", badgeLeft: "10 of 12 Left", badgeRight: "+₹0 / extra", included: 12, used: 2 },
  { title: "Maximum Revisions (12 of 12 used)", badgeLeft: "0 of 12 Left", badgeRight: "+₹500 / extra", included: 12, used: 12 },
];

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Revision Progress Bar Edge Cases</title>
  <style>
    body {
      background: #f8fafc;
      padding: 32px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 340px);
      gap: 20px;
    }
  </style>
</head>
<body>
  <h2 style="margin-bottom: 20px; color: #0f172a; font-size: 18px;">Segmented Revision Progress Bar - Edge Cases Verification</h2>
  <div class="grid">
    ${testCases.map(tc => renderCard(tc.title, tc.badgeLeft, tc.badgeRight, tc.included, tc.used)).join('')}
  </div>
</body>
</html>
`;

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 800, height: 700, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: 'E:/MitFloww/mitfloww_coming_soon/assets/test_revision_edge_cases.png', fullPage: true });
  console.log('Saved test_revision_edge_cases.png');
  await browser.close();
}

run().catch(console.error);

const { createRequire } = require('module');
const path = require('path');
const fs = require('fs');

const apiRequire = createRequire('e:/MitFloww/api/package.json');
const sharp = apiRequire('sharp');

async function convert() {
  const assetsDir = 'e:/MitFloww/mitfloww_coming_soon/assets';

  const conversions = [
    // 1. User file review -> ui-stage-review.webp and ui-file-review.webp
    {
      input: path.join(assetsDir, 'real_user_review.png'),
      output: path.join(assetsDir, 'ui-file-review.webp'),
      width: 1600,
      quality: 90
    },
    // 2. Share modal -> ui-share-modal.webp and ui-stage-prepare.webp
    {
      input: path.join(assetsDir, 'real_user_share_modal.png'),
      output: path.join(assetsDir, 'ui-share-modal.webp'),
      width: 1600,
      quality: 90
    },
    {
      input: path.join(assetsDir, 'real_user_share_modal.png'),
      output: path.join(assetsDir, 'ui-stage-prepare.webp'),
      width: 1600,
      quality: 90
    },
    // 3. Client review with real watermark -> ui-client-review.webp and ui-stage-review.webp
    {
      input: path.join(assetsDir, 'real_client_review.png'),
      output: path.join(assetsDir, 'ui-client-review.webp'),
      width: 1600,
      quality: 90
    },
    {
      input: path.join(assetsDir, 'real_client_review.png'),
      output: path.join(assetsDir, 'ui-stage-review.webp'),
      width: 1600,
      quality: 90
    },
    // 4. Client paid project -> ui-client-payment.webp, ui-stage-payment.webp, ui-stage-release.webp
    {
      input: path.join(assetsDir, 'real_client_paid.png'),
      output: path.join(assetsDir, 'ui-client-payment.webp'),
      width: 1600,
      quality: 90
    },
    {
      input: path.join(assetsDir, 'real_client_paid.png'),
      output: path.join(assetsDir, 'ui-stage-payment.webp'),
      width: 1600,
      quality: 90
    },
    {
      input: path.join(assetsDir, 'real_client_paid.png'),
      output: path.join(assetsDir, 'ui-stage-release.webp'),
      width: 1600,
      quality: 90
    },
    // 5. Dashboard -> ui-dashboard.webp
    {
      input: path.join(assetsDir, 'real_dashboard.png'),
      output: path.join(assetsDir, 'ui-dashboard.webp'),
      width: 1600,
      quality: 90
    }
  ];

  for (const item of conversions) {
    if (fs.existsSync(item.input)) {
      await sharp(item.input)
        .resize({ width: item.width, withoutEnlargement: true })
        .webp({ quality: item.quality, effort: 6 })
        .toFile(item.output);
      const stats = fs.statSync(item.output);
      console.log(`Converted ${path.basename(item.input)} -> ${path.basename(item.output)} (${Math.round(stats.size / 1024)} KB)`);
    } else {
      console.warn(`File not found: ${item.input}`);
    }
  }

  console.log('All WebP conversions completed!');
}

convert().catch(console.error);

const { createRequire } = require('module');
const path = require('path');
const fs = require('fs');

const apiRequire = createRequire('e:/MitFloww/api/package.json');
const sharp = apiRequire('sharp');

const assetsDir = path.resolve(__dirname, '../assets');

const conversions = [
  { src: 'real_light_projects.png', dest: 'ui-projects-light.webp', quality: 86 },
  { src: 'real_light_user_review_scrolled.png', dest: 'ui-review-comments-light.webp', quality: 86 },
  { src: 'real_light_user_share_modal.png', dest: 'ui-share-modal-light.webp', quality: 86 },
  { src: 'real_light_client_review.png', dest: 'ui-client-review-light.webp', quality: 86 },
  { src: 'real_light_client_paid.png', dest: 'ui-client-paid-light.webp', quality: 86 }
];

async function convert() {
  for (const item of conversions) {
    const srcPath = path.join(assetsDir, item.src);
    const destPath = path.join(assetsDir, item.dest);
    if (fs.existsSync(srcPath)) {
      console.log(`Converting ${item.src} -> ${item.dest}...`);
      await sharp(srcPath)
        .webp({ quality: item.quality, effort: 5 })
        .toFile(destPath);
      const stat = fs.statSync(destPath);
      console.log(`  Done: ${(stat.size / 1024).toFixed(1)} KB`);
    } else {
      console.warn(`Source file not found: ${item.src}`);
    }
  }
  console.log('Conversion complete!');
}

convert().catch(err => {
  console.error('Error during conversion:', err);
});

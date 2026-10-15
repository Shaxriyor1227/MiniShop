const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const urls = [
  { name: 'Home', url: 'http://localhost:5173/' },
  { name: 'Catalog', url: 'http://localhost:5173/catalog' },
  { name: 'ProductDetail', url: 'http://localhost:5173/product/6ac890a326961795498a85b0' },
  { name: 'Admin', url: 'http://localhost:5173/admin' }
];

const resultsDir = path.join(__dirname, 'lighthouse_results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

console.log('Starting Lighthouse Audits (Mobile Emulation)...\n');

const summary = [];

for (const item of urls) {
  const outputPath = path.join(resultsDir, `${item.name}.json`);
  console.log(`Running Lighthouse on ${item.name} (${item.url})...`);

  try {
    // Run lighthouse CLI in headless mobile mode
    const cmd = `npx lighthouse "${item.url}" --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="${outputPath}" --only-categories=performance --form-factor=mobile --screenEmulation.mobile=true --throttling-method=simulate --quiet`;
    execSync(cmd, { stdio: 'inherit' });

    const raw = fs.readFileSync(outputPath, 'utf8');
    const data = JSON.parse(raw);
    const audits = data.audits || {};
    const categories = data.categories || {};

    const perfScore = Math.round((categories.performance?.score || 0) * 100);
    const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
    const tbt = audits['total-blocking-time']?.displayValue || 'N/A';
    const cls = audits['cumulative-layout-shift']?.displayValue || 'N/A';
    
    // JS size
    const networkItems = audits['network-requests']?.details?.items || [];
    let jsBytes = 0;
    networkItems.forEach(req => {
      if (req.resourceType === 'Script' || (req.url && req.url.endsWith('.js'))) {
        jsBytes += (req.transferSize || req.resourceSize || 0);
      }
    });

    const resObj = {
      Page: item.name,
      Score: perfScore,
      LCP: lcp,
      TBT: tbt,
      CLS: cls,
      JS_Transfer_KB: (jsBytes / 1024).toFixed(1) + ' KB'
    };
    summary.push(resObj);
    console.log(`✓ ${item.name}: Score=${perfScore}, LCP=${lcp}, TBT=${tbt}, CLS=${cls}, JS=${resObj.JS_Transfer_KB}\n`);
  } catch (err) {
    console.error(`✗ Failed for ${item.name}:`, err.message);
  }
}

console.log('\n================ LIGHTHOUSE SUMMARY ================');
console.table(summary);

// Save summary to JSON
const summaryFile = path.join(resultsDir, 'summary.json');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
console.log(`Saved summary to ${summaryFile}`);

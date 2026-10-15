const fs = require('fs');
const path = require('path');
const sharp = require(path.join(__dirname, '../backend/node_modules/sharp'));

const targetDirs = [
  path.join(__dirname, '../frontend/public/images'),
  path.join(__dirname, '../frontend/src/assets/images')
];

let totalOriginalBytes = 0;
let totalWebpBytes = 0;
let convertedCount = 0;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath, stat);
    }
  });
}

async function convertImage(filePath, stat) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return;

  const parsed = path.parse(filePath);
  const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

  try {
    const originalSize = stat.size;
    totalOriginalBytes += originalSize;

    await sharp(filePath)
      .webp({ quality: 82, effort: 5 })
      .toFile(webpPath);

    const webpStat = fs.statSync(webpPath);
    const webpSize = webpStat.size;
    totalWebpBytes += webpSize;
    convertedCount++;

    const savedPercent = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);
    console.log(`✓ ${parsed.base} (${(originalSize/1024).toFixed(1)} KB) -> ${parsed.name}.webp (${(webpSize/1024).toFixed(1)} KB) [Saved ${savedPercent}%]`);
  } catch (err) {
    console.error(`✗ Error converting ${filePath}:`, err.message);
  }
}

async function run() {
  console.log('--- Starting WebP Conversion with sharp ---');
  for (const dir of targetDirs) {
    console.log(`\nScanning: ${dir}`);
    const filesToConvert = [];
    walkDir(dir, (filePath, stat) => {
      filesToConvert.push({ filePath, stat });
    });

    for (const item of filesToConvert) {
      await convertImage(item.filePath, item.stat);
    }
  }

  console.log('\n--- WebP Conversion Summary ---');
  console.log(`Total images converted: ${convertedCount}`);
  console.log(`Original total size: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`WebP total size:     ${(totalWebpBytes / (1024 * 1024)).toFixed(2)} MB`);
  const totalSaved = (((totalOriginalBytes - totalWebpBytes) / totalOriginalBytes) * 100).toFixed(1);
  console.log(`Total bandwidth saved: ${totalSaved}%!`);
}

run();

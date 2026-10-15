/**
 * MiniShop i18n Parity Checker
 * Validates that uz.json, ru.json, and en.json have 100% identical keys
 * and that no key has an empty string or undefined value.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, '../src/locales');
const uzPath = path.join(localesDir, 'uz.json');
const ruPath = path.join(localesDir, 'ru.json');
const enPath = path.join(localesDir, 'en.json');

const loadLocale = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[i18n:check] Error reading ${filePath}:`, err.message);
    process.exit(1);
  }
};

const flattenKeys = (obj, prefix = '') => {
  let keys = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(keys, flattenKeys(v, fullKey));
    } else {
      keys[fullKey] = v;
    }
  }
  return keys;
};

const uz = loadLocale(uzPath);
const ru = loadLocale(ruPath);
const en = loadLocale(enPath);

const uzKeys = flattenKeys(uz);
const ruKeys = flattenKeys(ru);
const enKeys = flattenKeys(en);

const allKeyNames = Array.from(
  new Set([...Object.keys(uzKeys), ...Object.keys(ruKeys), ...Object.keys(enKeys)])
).sort();

let errors = [];

// 1. Check for missing keys across all 3 locales
allKeyNames.forEach((key) => {
  const inUz = Object.prototype.hasOwnProperty.call(uzKeys, key);
  const inRu = Object.prototype.hasOwnProperty.call(ruKeys, key);
  const inEn = Object.prototype.hasOwnProperty.call(enKeys, key);

  if (!inUz) errors.push(`[MISSING IN UZ] Key: "${key}"`);
  if (!inRu) errors.push(`[MISSING IN RU] Key: "${key}"`);
  if (!inEn) errors.push(`[MISSING IN EN] Key: "${key}"`);
});

// 2. Check for empty string values
allKeyNames.forEach((key) => {
  if (uzKeys[key] === '' || uzKeys[key] === null || uzKeys[key] === undefined) {
    errors.push(`[EMPTY VALUE IN UZ] Key: "${key}"`);
  }
  if (ruKeys[key] === '' || ruKeys[key] === null || ruKeys[key] === undefined) {
    errors.push(`[EMPTY VALUE IN RU] Key: "${key}"`);
  }
  if (enKeys[key] === '' || enKeys[key] === null || enKeys[key] === undefined) {
    errors.push(`[EMPTY VALUE IN EN] Key: "${key}"`);
  }
});

console.log('----------------------------------------------------');
console.log('       MiniShop i18n Parity & Integrity Check       ');
console.log('----------------------------------------------------');
console.log(`Total unique translation keys: ${allKeyNames.length}`);
console.log(`- uz.json keys: ${Object.keys(uzKeys).length}`);
console.log(`- ru.json keys: ${Object.keys(ruKeys).length}`);
console.log(`- en.json keys: ${Object.keys(enKeys).length}`);

if (errors.length > 0) {
  console.error('\n❌ FAIL: Found ' + errors.length + ' i18n parity error(s):');
  errors.forEach((err) => console.error('  ' + err));
  console.log('----------------------------------------------------\n');
  process.exit(1);
} else {
  console.log('\n✅ PASS: All 3 translation files have 100% identical keys and valid values.');
  console.log('----------------------------------------------------\n');
  process.exit(0);
}

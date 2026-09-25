// Post-build guard for the "zero runtime deps, no React" promise:
// the published JS and .d.ts must not reference react or thinking-orbs,
// and must not reach for network/storage/eval APIs.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN = [
  /from\s*["']react/,
  /require\(\s*["']react/,
  /["']thinking-orbs(\/[^"']*)?["']/,
  /\bfetch\s*\(/,
  /XMLHttpRequest/,
  /WebSocket/,
  /\beval\s*\(/,
  /new\s+Function\s*\(/,
  /innerHTML/,
  /localStorage|sessionStorage/,
  /document\.cookie/
];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk('dist').filter((f) => /\.(js|d\.ts)$/.test(f));
let failed = false;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const re of FORBIDDEN) {
    if (re.test(src)) {
      console.error(`✗ ${f} matches ${re}`);
      failed = true;
    }
  }
}
if (failed) process.exit(1);
console.log(`✓ ${files.length} dist files clean`);

// scripts/sync-cli-docs.js
//
// Copies the externally-maintained CLI submodule docs into
// docs/reference/cli/ at build time. Source of truth stays in
// external/vantage-cli/. The destination is gitignored.
//
// Usage: node scripts/sync-cli-docs.js [base-path]
//   base-path defaults to '/reference/cli/'
//
// Run before `yarn build` and `yarn start`.

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'external', 'vantage-cli', 'docusaurus', 'docs');
const DST = path.resolve(__dirname, '..', 'docs', 'reference', 'cli');
const BASE_PATH = process.argv[2] || '/reference/cli/';

if (!BASE_PATH.endsWith('/')) {
  console.error('[sync-cli-docs] base-path must end with /');
  process.exit(1);
}

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, {recursive: true, force: true});
}

function walk(dir, fn) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fn);
    else fn(full);
  }
}

function copyTree(src, dst) {
  fs.mkdirSync(dst, {recursive: true});
  for (const entry of fs.readdirSync(src, {withFileTypes: true})) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyTree(s, d);
    else fs.copyFileSync(s, d);
  }
}

function rewriteLinks(text, filePath) {
  let out = text;
  // If this is the index.md, rewrite the root slug to the CLI base path.
  // The upstream CLI repo uses slug: / which conflicts with our docs root.
  if (filePath && path.basename(filePath) === 'index.md') {
    out = out.replace(/^(slug:\s*)\/\s*$/m, `$1${BASE_PATH}`);
  }
  // Old plugin used routeBasePath '/cli'. Rewrite to the new prefix.
  out = out
    .replace(/\(\/vantage-cli\//g, `(${BASE_PATH}`)
    .replace(/\(\/cli\//g, `(${BASE_PATH}`)
    .replace(/href="\/vantage-cli\//g, `href="${BASE_PATH}`)
    .replace(/href="\/cli\//g, `href="${BASE_PATH}`)
    // Cross-section links to other Vantage docs (old paths):
    .replace(/\(\/platform\/jobs\//g, '(/products/jobs/')
    .replace(/\(\/platform\/storage\//g, '(/products/storage/')
    .replace(/\(\/platform\/notebooks\//g, '(/products/workbench/sessions/notebooks/')
    .replace(/\(\/platform\/remote-desktops\//g, '(/products/workbench/sessions/remote-desktops/')
    .replace(/\(\/sdk\//g, '(/reference/sdk/')
    .replace(/\(\/api\//g, '(/reference/api/');
  return out;
}

function processFile(p) {
  if (!/\.(md|mdx)$/.test(p)) return;
  const text = fs.readFileSync(p, 'utf8');
  const next = rewriteLinks(text, p);
  if (next !== text) fs.writeFileSync(p, next);
}

console.log(`[sync-cli-docs] ${SRC} -> ${DST}`);
if (!fs.existsSync(SRC)) {
  console.error(`[sync-cli-docs] missing source: ${SRC}`);
  console.error(`[sync-cli-docs] run \`git submodule update --init --recursive\``);
  process.exit(1);
}
rmrf(DST);
copyTree(SRC, DST);
walk(DST, processFile);
console.log(`[sync-cli-docs] done`);

// scripts/migrate-doc-links.js — one-shot rewrite. Delete after running.
//
// Walks docs/, rewrites old plugin paths to new IA paths in every
// .md/.mdx file. See spec § Migration mechanics step 5.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'docs');

// Order matters: rewrite the more-specific paths first.
const RULES = [
  [/\(\/platform\/notebooks\//g,        '(/products/workbench/sessions/notebooks/'],
  [/\(\/platform\/remote-desktops\//g,  '(/products/workbench/sessions/remote-desktops/'],
  [/\(\/platform\/jobs\//g,             '(/products/jobs/'],
  [/\(\/platform\/storage\//g,          '(/products/storage/'],
  [/\(\/getting-started\//g,            '(/get-started/'],
  [/\(\/cli\//g,                        '(/reference/cli/'],
  [/\(\/sdk\//g,                        '(/reference/sdk/'],
  [/\(\/api\//g,                        '(/reference/api/'],
  // href= form (HTML-in-MDX)
  [/href="\/platform\/notebooks\//g,        'href="/products/workbench/sessions/notebooks/'],
  [/href="\/platform\/remote-desktops\//g,  'href="/products/workbench/sessions/remote-desktops/'],
  [/href="\/platform\/jobs\//g,             'href="/products/jobs/'],
  [/href="\/platform\/storage\//g,          'href="/products/storage/'],
  [/href="\/getting-started\//g,            'href="/get-started/'],
  [/href="\/cli\//g,                        'href="/reference/cli/'],
  [/href="\/sdk\//g,                        'href="/reference/sdk/'],
  [/href="\/api\//g,                        'href="/reference/api/'],
];

function walk(dir, fn) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fn);
    else fn(full);
  }
}

let changedCount = 0;
walk(ROOT, (p) => {
  if (!/\.(md|mdx)$/.test(p)) return;
  const before = fs.readFileSync(p, 'utf8');
  let after = before;
  for (const [from, to] of RULES) after = after.replace(from, to);
  if (after !== before) {
    fs.writeFileSync(p, after);
    changedCount++;
    console.log('rewrote:', path.relative(ROOT, p));
  }
});
console.log(`[migrate-doc-links] rewrote ${changedCount} files`);

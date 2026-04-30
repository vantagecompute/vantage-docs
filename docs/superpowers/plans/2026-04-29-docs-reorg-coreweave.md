# Vantage Docs Reorg — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four plugin instances with one unified docs site shaped like docs.coreweave.com, lift the Vantage AI Workbench User Guide design into `products/workbench/`, and add the page-header chrome (search pill, Ask AI, Copy MCP, floating chat) as non-functional placeholders.

**Architecture:** Single `@docusaurus/preset-classic` docs plugin owns everything. CLI submodule docs are copied at build time via a sync script; `docs/reference/cli/` is gitignored. Workbench docs are converted from a single HTML file into per-page MDX. Chrome components are swizzled into `@theme/DocItem/Layout` and a `Root.js` mount.

**Tech Stack:** Docusaurus 3.10 (classic preset), React 18, TypeScript, Algolia DocSearch (already wired), no test framework — verification via `docusaurus build` and manual smoke checks.

**Spec:** `docs/superpowers/specs/2026-04-29-docs-reorg-coreweave-design.md`

**Source design bundle:** `/tmp/design-extract/vantage-kubeflow-integration/project/Workbench User Guide.html` (re-extract from `vantage-kubeflow-integration` if missing).

---

## File Map

### Created
- `scripts/sync-cli-docs.js` — copies CLI submodule docs into `docs/reference/cli/` and rewrites links
- `scripts/migrate-doc-links.js` — one-shot link rewrite over all moved markdown (delete after run)
- `docs/concepts/{index,workspaces,jobs-and-pipelines,compute-and-clusters,teams-and-iam}.md`
- `docs/changelog.md`, `docs/support.md`, `docs/glossary.md`
- `docs/platform/workbench/**` — ~25 MDX files converted from `Workbench User Guide.html`
- `src/components/AskAIButton/{index.tsx,styles.module.css}`
- `src/components/CopyMcpServerButton/{index.tsx,styles.module.css}`
- `src/components/FloatingAskWidget/{index.tsx,styles.module.css}`
- `src/components/ProductIcon/index.tsx`
- `src/theme/DocItem/Layout/index.tsx` — swizzle, injects page-header chrome
- `src/theme/Root.js` — swizzle, mounts `FloatingAskWidget` site-wide

### Modified
- `docusaurus.config.js` — drop four `@docusaurus/plugin-content-docs` entries; remove centered navbar title
- `sidebars-main.js` — full rewrite (CoreWeave-shaped tree)
- `src/css/custom.css` — add styles for chrome components, restyle `.DocSearch-Button` as pill
- `src/theme/DocBreadcrumbs/index.tsx` — delete `DocumentationDropdown` and its mount
- `src/theme/Navbar/index.tsx` — inject `AskAIButton` next to search
- `justfile` — `build` recipe runs `sync-cli-docs.js` before `yarn build`
- `.gitignore` — add `docs/reference/cli/`

### Renamed / Moved (`git mv`)
- `docs/getting-started/` → `docs/get-started/`
- `docs-platform/jobs/` → `docs/platform/jobs/`
- `docs-platform/storage/` → `docs/platform/storage/`
- `docs-platform/notebooks/` → `docs/platform/workbench/sessions/notebooks/`
- `docs-platform/remote-desktops/` → `docs/platform/workbench/sessions/remote-desktops/`
- `docs-platform/{clusters,compute-providers,federations,iam,teams,licenses}/` → `docs/platform/<same>/`
- `docs-sdk/` → `docs/reference/sdk/`
- `docs-api/` → `docs/reference/api/`

### Deleted (after moves are complete)
- Empty `docs-platform/`, `docs-sdk/`, `docs-api/` directories
- `scripts/transform-cli-links.js` — superseded by `sync-cli-docs.js`

---

## Phase 1: CLI submodule sync (non-breaking infrastructure)

### Task 1: Create the CLI sync script

**Files:**
- Create: `scripts/sync-cli-docs.js`

- [ ] **Step 1: Write the script**

```javascript
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

function rewriteLinks(text) {
  // Old plugin used routeBasePath '/cli'. Rewrite to the new prefix.
  return text
    .replace(/\(\/vantage-cli\//g, `(${BASE_PATH}`)
    .replace(/\(\/cli\//g, `(${BASE_PATH}`)
    .replace(/href="\/vantage-cli\//g, `href="${BASE_PATH}`)
    .replace(/href="\/cli\//g, `href="${BASE_PATH}`)
    // Cross-section links to other Vantage docs (old paths):
    .replace(/\(\/platform\/jobs\//g, '(/platform/jobs/')
    .replace(/\(\/platform\/storage\//g, '(/platform/storage/')
    .replace(/\(\/platform\/notebooks\//g, '(/platform/workbench/sessions/notebooks/')
    .replace(/\(\/platform\/remote-desktops\//g, '(/platform/workbench/sessions/remote-desktops/')
    .replace(/\(\/sdk\//g, '(/reference/sdk/')
    .replace(/\(\/api\//g, '(/reference/api/');
}

function processFile(p) {
  if (!/\.(md|mdx)$/.test(p)) return;
  const text = fs.readFileSync(p, 'utf8');
  const next = rewriteLinks(text);
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
```

- [ ] **Step 2: Make it executable for documentation**

```bash
chmod +x scripts/sync-cli-docs.js
```

- [ ] **Step 3: Run it once and inspect output**

```bash
node scripts/sync-cli-docs.js
ls docs/reference/cli | head
grep -r "/vantage-cli/" docs/reference/cli || echo "OK: no leftover /vantage-cli/ links"
```

Expected: `index.md`, `commands.mdx`, `installation.md`, etc. listed; grep returns "OK".

- [ ] **Step 4: Commit the script**

```bash
git add scripts/sync-cli-docs.js
git commit -m "docs: add CLI submodule sync script for unified docs site"
```

---

### Task 2: Gitignore the synced CLI directory

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Append the ignore rule**

Append to `.gitignore`:
```
# Generated by scripts/sync-cli-docs.js — source lives in external/vantage-cli
docs/reference/cli/
```

- [ ] **Step 2: Verify git ignores it**

```bash
git status --porcelain docs/reference/cli/ | wc -l
```

Expected: `0` (no files staged from that path).

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "docs: gitignore generated CLI reference docs"
```

---

### Task 3: Wire sync script into build + dev recipes

**Files:**
- Modify: `justfile`

- [ ] **Step 1: Update the build recipe**

Replace the `build` recipe in `justfile` (current line: `node scripts/transform-cli-links.js /cli/`) with:

```just
# Build Docusaurus for production
[group("docusaurus")]
build: install
    @echo "🏗️ Building Docusaurus for production..."
    node scripts/sync-cli-docs.js /reference/cli/
    yarn build
```

- [ ] **Step 2: Update the `dev` recipe to also sync**

```just
# Start Docusaurus development server
[group("docusaurus")]
dev: install
    @echo "🚀 Starting Docusaurus development server..."
    node scripts/sync-cli-docs.js /reference/cli/
    yarn start
```

- [ ] **Step 3: Commit**

```bash
git add justfile
git commit -m "docs: wire CLI sync script into build and dev recipes"
```

---

## Phase 2: Content moves (git mv batches)

### Task 4: Rename getting-started → get-started

**Files:**
- Rename: `docs/getting-started/` → `docs/get-started/`

- [ ] **Step 1: Move the directory**

```bash
git mv docs/getting-started docs/get-started
```

- [ ] **Step 2: Verify**

```bash
test -d docs/get-started && test ! -d docs/getting-started && echo OK
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: rename getting-started to get-started for CoreWeave-shaped IA"
```

---

### Task 5: Move products (jobs, storage)

**Files:**
- Rename: `docs-platform/jobs/` → `docs/platform/jobs/`
- Rename: `docs-platform/storage/` → `docs/platform/storage/`

- [ ] **Step 1: Create the parent directory**

```bash
mkdir -p docs/products
```

- [ ] **Step 2: Move both directories**

```bash
git mv docs-platform/jobs docs/products/jobs
git mv docs-platform/storage docs/products/storage
```

- [ ] **Step 3: Delete now-stale per-folder sidebar.js files**

```bash
rm -f docs/platform/jobs/sidebar.js docs/platform/storage/sidebar.js
```

(The new unified sidebar lives at `sidebars-main.js`. Per-folder sidebar files are no longer used.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: lift jobs and storage to products/ branch"
```

---

### Task 6: Move notebooks + remote-desktops under Workbench → Sessions

**Files:**
- Rename: `docs-platform/notebooks/` → `docs/platform/workbench/sessions/notebooks/`
- Rename: `docs-platform/remote-desktops/` → `docs/platform/workbench/sessions/remote-desktops/`

- [ ] **Step 1: Create the parent path**

```bash
mkdir -p docs/platform/workbench/sessions
```

- [ ] **Step 2: Move**

```bash
git mv docs-platform/notebooks docs/platform/workbench/sessions/notebooks
git mv docs-platform/remote-desktops docs/platform/workbench/sessions/remote-desktops
```

- [ ] **Step 3: Delete stale sidebar.js**

```bash
rm -f docs/platform/workbench/sessions/notebooks/sidebar.js
rm -f docs/platform/workbench/sessions/remote-desktops/sidebar.js
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: place notebooks and remote-desktops under workbench/sessions"
```

---

### Task 7: Move admin areas to platform/

**Files:**
- Rename: `docs-platform/{clusters,compute-providers,federations,iam,teams,licenses}/` → `docs/platform/<same>/`

- [ ] **Step 1: Create destination**

```bash
mkdir -p docs/platform
```

- [ ] **Step 2: Move all six**

```bash
git mv docs-platform/clusters docs/platform/clusters
git mv docs-platform/compute-providers docs/platform/compute-providers
git mv docs-platform/federations docs/platform/federations
git mv docs-platform/iam docs/platform/iam
git mv docs-platform/teams docs/platform/teams
git mv docs-platform/licenses docs/platform/licenses
```

- [ ] **Step 3: Move/delete the remaining root files in docs-platform**

```bash
git mv docs-platform/index.md docs/platform/index.md
rm -f docs-platform/sidebar.js
# Confirm directory is empty:
ls docs-platform/ 2>&1
```

If anything remains, move it; otherwise:

```bash
rmdir docs-platform
```

- [ ] **Step 4: Delete per-area sidebar.js files**

```bash
find docs/platform -name sidebar.js -delete
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: lift admin areas (clusters, IAM, teams, ...) to platform/ branch"
```

---

### Task 8: Move SDK and API to reference/

**Files:**
- Rename: `docs-sdk/` → `docs/reference/sdk/`
- Rename: `docs-api/` → `docs/reference/api/`

- [ ] **Step 1: Create destination**

```bash
mkdir -p docs/reference
```

- [ ] **Step 2: Move both**

```bash
git mv docs-sdk docs/reference/sdk
git mv docs-api docs/reference/api
```

- [ ] **Step 3: Delete stale sidebar.js files**

```bash
rm -f docs/reference/sdk/sidebar.js docs/reference/api/sidebar.js
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: lift SDK and API docs to reference/ branch"
```

---

## Phase 3: New stub content

### Task 9: Create concepts/ stubs

**Files:**
- Create: `docs/concepts/index.md`
- Create: `docs/concepts/workspaces.md`
- Create: `docs/concepts/jobs-and-pipelines.md`
- Create: `docs/concepts/compute-and-clusters.md`
- Create: `docs/concepts/teams-and-iam.md`

- [ ] **Step 1: Write `docs/concepts/index.md`**

```markdown
---
title: Concepts
description: Core mental models that show up across every Vantage product.
---

# Concepts

Five mental models that show up across every Vantage product. Read these once and the rest of the docs make more sense.

- [Workspaces](./workspaces) — Your team's slice of the cluster (quota, RBAC, cost envelope).
- [Jobs and pipelines](./jobs-and-pipelines) — Finite computational work and the DAGs that orchestrate it.
- [Compute and clusters](./compute-and-clusters) — Where workloads physically run; profiles, providers, and regions.
- [Teams and IAM](./teams-and-iam) — How permissions, ownership, and collaboration work.
```

- [ ] **Step 2: Write `docs/concepts/workspaces.md`**

```markdown
---
title: Workspaces
description: Your team's slice of the cluster, with quota, RBAC, and a cost envelope.
---

# Workspaces

A workspace is your team's slice of the Vantage cluster. Workspaces hold quota (CPUs, memory, GPUs, storage), an RBAC scope, and a cost envelope. Resources you create in Vantage live inside one workspace at a time. The current workspace is shown in the top-right of the screen — switch with the workspace picker.

:::info Coming soon
This page is a stub. Detailed workspace concepts will be expanded in a follow-up content pass.
:::
```

- [ ] **Step 3: Write `docs/concepts/jobs-and-pipelines.md`**

```markdown
---
title: Jobs and pipelines
description: Finite computational work and the DAGs that orchestrate it.
---

# Jobs and pipelines

Jobs are finite computational workloads — single-shot or distributed. Pipelines are multi-step DAGs that string jobs (and other steps) together for ingestion, training, evaluation, and deployment.

:::info Coming soon
This page is a stub. Detailed job/pipeline concepts will land in a follow-up content pass.
:::
```

- [ ] **Step 4: Write `docs/concepts/compute-and-clusters.md`**

```markdown
---
title: Compute and clusters
description: Where workloads physically run — profiles, providers, regions.
---

# Compute and clusters

A cluster is a Kubernetes cluster Vantage manages on your behalf. Compute profiles describe the *shape* of compute (GPU type, count, autoscaling bounds, instance class) and are reused across products. Compute providers (AWS, Azure, GCP, on-prem) are the physical substrate.

:::info Coming soon
This page is a stub. Cluster and compute-profile detail lands in a follow-up content pass.
:::
```

- [ ] **Step 5: Write `docs/concepts/teams-and-iam.md`**

```markdown
---
title: Teams and IAM
description: How permissions, ownership, and collaboration work.
---

# Teams and IAM

Teams group users and own resources. IAM (identity and access management) controls what each team member can do — read, write, delete, deploy.

:::info Coming soon
This page is a stub. Concrete role/permission detail lands in a follow-up content pass.
:::
```

- [ ] **Step 6: Commit**

```bash
git add docs/concepts
git commit -m "docs: scaffold concepts/ branch with five core mental-model stubs"
```

---

### Task 10: Create top-level changelog/support/glossary stubs

**Files:**
- Create: `docs/changelog.md`, `docs/support.md`, `docs/glossary.md`

- [ ] **Step 1: Write `docs/changelog.md`**

```markdown
---
title: Changelog
description: Notable changes to Vantage.
---

# Changelog

:::info Coming soon
The changelog will be auto-generated from product release notes in a follow-up.
:::
```

- [ ] **Step 2: Write `docs/support.md`**

```markdown
---
title: Support
description: How to get help with Vantage.
---

# Support

- **Slack:** [vantagecompute.slack.com](https://vantagecompute.slack.com) — fastest answers from the team and other users.
- **GitHub:** [github.com/vantagecompute](https://github.com/vantagecompute) — file issues, contribute fixes.
- **Sales / Demos:** [vantagecompute.ai/contact](https://vantagecompute.ai/contact)
```

- [ ] **Step 3: Write `docs/glossary.md`**

Use the glossary directly from the Workbench User Guide design (`<section id="glossary">` in `Workbench User Guide.html`):

```markdown
---
title: Glossary
description: Terms used across the Vantage docs.
---

# Glossary

**Workspace** — Your team's slice of the Vantage cluster, with quota, RBAC, and a cost envelope.

**Cluster** — A physical Kubernetes cluster Vantage manages. Workspaces live inside clusters; users can switch between clusters their team has access to.

**Compute profile** — Reusable shape of compute (GPU + count + instance type + bounds).

**Session** — An interactive notebook environment.

**Model** — A registered, versioned artifact in the catalog.

**Endpoint** — An inference service serving a model behind an HTTP URL.

**Training job** — A finite, distributed training run.

**Pipeline** — A multi-step DAG of containerized tasks.

**Sweep** — A hyperparameter-search experiment containing many trial runs.

**Trial** — One concrete run inside a sweep, with one specific parameter combination.

**Initializer** — A pre-training step that fetches a dataset or base model into local cache.

**Runtime** — A pre-built training environment — framework + image + parallelism strategy.

**Canary** — A new endpoint version receiving a fraction of traffic during a rollout.

**Idle spend** — Cost accrued by compute that's reserved but not running work (typically GPU util < 5%).
```

- [ ] **Step 4: Commit**

```bash
git add docs/changelog.md docs/support.md docs/glossary.md
git commit -m "docs: add changelog/support/glossary top-level stubs"
```

---

### Task 11: Stub Diátaxis subfolders for products and platform branches

For products following the Diátaxis shape (`jobs`, `storage`, all `platform/<area>/`), add a placeholder `index.md` to any empty `tutorials/`, `how-to-guides/`, or `reference/` directory so the sidebar autogenerator picks them up.

**Files:**
- Create as needed: `docs/platform/storage/{tutorials,how-to-guides,reference}/index.md`
- Create as needed: `docs/platform/{clusters,compute-providers,federations,iam,teams,licenses}/{tutorials,how-to-guides,reference}/index.md`

(Skip directories that already have content. `docs/platform/jobs/` already has all three branches populated.)

- [ ] **Step 1: Identify empty branches**

```bash
for area in docs/products/storage docs/platform/clusters docs/platform/compute-providers docs/platform/federations docs/platform/iam docs/platform/teams docs/platform/licenses; do
  for sub in tutorials how-to-guides reference; do
    if [ ! -d "$area/$sub" ] || [ -z "$(ls -A $area/$sub 2>/dev/null)" ]; then
      echo "EMPTY: $area/$sub"
    fi
  done
done
```

- [ ] **Step 2: Write a stub for each empty branch**

Use this template (replace `<Area>` and `<branch>` per-instance):

```markdown
---
title: <branch capitalized>
description: <branch> for <Area>.
---

# <Area> — <branch capitalized>

:::info Coming soon
This section is empty for now. <Branch sentence>
:::
```

Where `<Branch sentence>` is one of:
- tutorials → "Long-form walkthroughs are being written; expect them in the next docs pass."
- how-to-guides → "Task-oriented recipes are being written; expect them in the next docs pass."
- reference → "Field/schema reference is being generated from API specs; expect it in the next docs pass."

For each EMPTY directory listed in Step 1, create the stub:

```bash
mkdir -p <path>
cat > <path>/index.md <<'EOF'
---
title: ...
description: ...
---
...
EOF
```

- [ ] **Step 3: Commit**

```bash
git add docs/products docs/platform
git commit -m "docs: stub empty Diátaxis subfolders so the sidebar tree is consistent"
```

---

## Phase 4: Workbench MDX conversion

The source is `Workbench User Guide.html` (extract from the design bundle if missing — see plan header). It has 14 `<section id="...">` blocks. Each becomes one or more `.mdx` files under `docs/platform/workbench/`.

### Task 12: Workbench root pages — overview / quickstart / concepts / shortcuts / troubleshooting

**Files:**
- Create: `docs/platform/workbench/index.mdx`
- Create: `docs/platform/workbench/get-started.mdx`
- Create: `docs/platform/workbench/concepts.mdx`
- Create: `docs/platform/workbench/shortcuts.mdx`
- Create: `docs/platform/workbench/troubleshooting.mdx`

For each file: lift the prose verbatim from the matching `<section>` in the source HTML and convert HTML → MDX:

| HTML section | MDX file | Notes |
|---|---|---|
| `<section id="overview">` | `index.mdx` | Use the lede + the "What you'll find inside" card grid |
| `<section id="quickstart">` | `get-started.mdx` | Convert `<ol class="steps">` to a regular numbered list with **bold** step titles |
| `<section id="concepts">` | `concepts.mdx` | Five sub-headings: Workspace, Compute profile, Lifecycle, Cost, Observability |
| `<section id="shortcuts">` | `shortcuts.mdx` | Keep the `<table class="tbl">` as-is — Docusaurus tables render it cleanly |
| `<section id="troubleshooting">` | `troubleshooting.mdx` | Three Q&A blocks |

Conversion rules (apply to every section):

1. `<div class="callout callout--info">…</div>` → `:::info` admonition
2. `<div class="callout callout--warn">…</div>` → `:::warning`
3. `<div class="callout callout--ok">…</div>` → `:::tip`
4. `<div class="callout callout--danger">…</div>` → `:::danger`
5. `<div class="callout callout--preview">…</div>` → `:::caution[Preview]`
6. `<table class="tbl">` → standard markdown table (or HTML table if formatting is heavy)
7. `<kbd>X</kbd>` → keep as `<kbd>X</kbd>` (custom CSS handles styling)
8. `<code class="name">` → backtick inline code
9. Drop `<svg>` icon markup; replace section-header SVGs with `<ProductIcon name="<tool>"/>` once that component exists (Task 21)
10. Drop `<div class="shot">…</div>` mock UI shots — they reference design-system classes we don't expose to MDX

- [ ] **Step 1: Write `docs/platform/workbench/index.mdx`**

```mdx
---
title: Workbench
description: AI/ML workspace — sessions, models, endpoints, training, pipelines, sweeps.
---

# The Vantage AI Workbench

Workbench is where you build, train, and serve machine-learning models on Vantage. It bundles eight tools — sessions, models, endpoints, training jobs, pipelines, sweeps, compute profiles, and observability — into one workspace, all sharing the same compute, storage, and cost envelope.

:::info
**Workbench replaces the Kubeflow dashboard.** Everything you'd reach through Kubeflow Notebooks, KServe, Trainer, Katib, and the Pipelines UI is here under native Vantage primitives — without the namespaces, CRDs, and Istio routes leaking through.
:::

## What you'll find inside

- **[Sessions](./sessions)** — Interactive notebook environments — Jupyter, VS Code, RStudio — pinned to GPU pools and your team's storage.
- **[Models](./models)** — Versioned model catalog. Pull from HuggingFace or your own training runs, then deploy to an endpoint.
- **[Endpoints](./endpoints)** — Inference services with autoscaling, canary rollouts, and authenticated URLs. Predictive or LLM.
- **[Training Jobs](./training-jobs)** — Distributed training on PyTorch, DeepSpeed, or MLX runtimes. Retry, suspend, resume.
- **[Pipelines](./pipelines)** — Multi-step DAGs that orchestrate ingestion, training, evaluation, and deployment.
- **[Sweeps](./sweeps)** — Hyperparameter search with Bayesian, grid, or random algorithms — tracked end-to-end.
- **[Compute Profiles](./compute-profiles)** — The reusable shape of your compute: GPU type, count, autoscaling bounds, instance class.
- **[Observability](./observability)** — Cluster-wide rollups of utilization, spend, idle GPU hours, and live alerts.
```

- [ ] **Step 2: Write the remaining four root files**

For each of `get-started.mdx`, `concepts.mdx`, `shortcuts.mdx`, `troubleshooting.mdx`, open the corresponding `<section>` in `Workbench User Guide.html`, copy the prose, and apply the conversion rules above. Each file's frontmatter:

```yaml
---
title: <Section title>
description: <one-line summary>
---
```

- [ ] **Step 3: Build and verify all five render**

```bash
npx docusaurus build --no-minify 2>&1 | tail -5
```

Expected: `[SUCCESS] Generated static files in "build".` Visit `/products/workbench`, `/platform/workbench/get-started`, etc., in the build output to confirm.

- [ ] **Step 4: Commit**

```bash
git add docs/products/workbench
git commit -m "docs: convert Workbench overview/quickstart/concepts/shortcuts/troubleshooting from design HTML"
```

---

### Task 13: Sessions branch

**Files:**
- Create: `docs/platform/workbench/sessions/index.mdx`
- Create: `docs/platform/workbench/sessions/creating-a-session.mdx`
- Create: `docs/platform/workbench/sessions/lifecycle.mdx`
- Create: `docs/platform/workbench/sessions/reference.mdx`

The source is `<section id="sessions">` in the User Guide. It has these subsections (all under one `<h2>`):

| HTML subsection | MDX file |
|---|---|
| Lede + "The sessions list" + mock-shot | `sessions/index.mdx` |
| "Creating a session" + field-reference table | `sessions/creating-a-session.mdx` |
| "Lifecycle actions" table + "The detail page" prose | `sessions/lifecycle.mdx` |
| Field reference (separate from creation) — pull every `<code class="name">` field from the User Guide and tabulate | `sessions/reference.mdx` |

- [ ] **Step 1: Write `sessions/index.mdx`**

```mdx
---
title: Sessions
description: Interactive notebook environments — your day-to-day workspace.
---

# Sessions

Sessions are **JupyterLab, VS Code, or RStudio** instances pinned to your team's storage and a chosen compute profile. They're the fastest way onto a GPU on Vantage.

A session can also be a **[notebook](./notebooks)** (a Jupyter-style web UI) or a **[remote desktop](./remote-desktops)** (a full GUI environment) — both are session types and live in their own sub-pages.

## The sessions list

The list view shows everyone's sessions in your workspace. Each row gives you the name, image, compute profile, status, owner, and elapsed runtime.

Lifecycle actions — Open, Stop, Start, Edit, Delete — live on each row's overflow menu and on the detail page. See [Lifecycle](./lifecycle) for what each one does.

## Next steps

- [Creating a session](./creating-a-session) — wizard walkthrough
- [Lifecycle](./lifecycle) — what each action does
- [Reference](./reference) — every field, every default
```

- [ ] **Step 2: Write `sessions/creating-a-session.mdx`**

Lift the "Creating a session" subsection of `<section id="sessions">`. Convert the `<table class="tbl fieldref">` to a markdown table:

```markdown
| Field | Required | What it does |
|---|---|---|
| `Name` | required | DNS-friendly identifier — lowercase letters, digits, dashes, max 63 chars. Becomes the session's URL slug. |
| `Image` | required | The notebook stack. Pick a preset (Jupyter / VS Code / RStudio) or paste a custom image reference. |
| `Compute profile` | optional | Where the session runs. Defaults to your workspace's default profile. |
| `CPU / Memory` | optional | Override the profile's defaults. Use sizing presets (XS → XL) unless you have a specific request. |
| `GPU` | optional | Vendor and count. Only profiles flagged GPU-capable will accept a non-zero count. |
| `Workspace volume` | optional | Your home directory. Either create a new persistent volume (default 5 GiB) or mount an existing claim. |
| `Data volumes` | optional | Additional mounts — datasets, scratch space, shared team caches. Each can be read-only. |
| `Configurations` | optional | Pre-defined "pod defaults" your admin set up — env vars, secrets, init scripts. Toggle the ones you need. |
| `Environment variables` | optional | Inline key/value pairs for things like `HF_TOKEN` or `WANDB_API_KEY`. |

:::info
Sessions inherit your workspace's secrets bundle automatically. Don't paste tokens into `env` if there's already a managed secret for it — your admin can show you the list.
:::
```

- [ ] **Step 3: Write `sessions/lifecycle.mdx`**

Lift "Lifecycle actions" + "The detail page" + the warn callout about idle sessions. Convert the lifecycle `<table class="tbl">` to markdown.

- [ ] **Step 4: Write `sessions/reference.mdx`**

Aggregate every field name from the creation wizard into a single reference table with type, default, and constraint columns. Source: the same field-reference table; expand with type info inferable from the User Guide prose (`Name` is string, `GPU count` is int, etc.).

- [ ] **Step 5: Build and verify**

```bash
npx docusaurus build --no-minify 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add docs/platform/workbench/sessions
git commit -m "docs: convert Workbench Sessions section from design HTML"
```

---

### Task 14: Tools batch 1 — Models, Endpoints, Training Jobs

**Files:**
- Create: `docs/platform/workbench/models/{index,registering-a-model,reference}.mdx`
- Create: `docs/platform/workbench/endpoints/{index,predictive-vs-llm,deploying,autoscaling,canary-rollouts,reference}.mdx`
- Create: `docs/platform/workbench/training-jobs/{index,runtimes,submitting-a-job,lifecycle,reference}.mdx`

Source: `<section id="models">`, `<section id="endpoints">`, `<section id="training-jobs">`. Apply the same conversion rules from Task 12.

- [ ] **Step 1: Write Models pages**

`models/index.mdx` — overview + "Registering a model" lead, links to sub-pages.
`models/registering-a-model.mdx` — full wizard prose + the source-type table.
`models/reference.mdx` — `kv` definition list converted to a markdown table (Description, Labels, Custom properties, Artifact URI).

- [ ] **Step 2: Write Endpoints pages**

`endpoints/index.mdx` — lede + "Predictive vs LLM" intro.
`endpoints/predictive-vs-llm.mdx` — the kind comparison table, expanded.
`endpoints/deploying.mdx` — "Deploying an endpoint" steps.
`endpoints/autoscaling.mdx` — the autoscaling section + the scale-to-zero callout.
`endpoints/canary-rollouts.mdx` — the canary section + the OK callout about Promote.
`endpoints/reference.mdx` — URL pattern, all knobs, status codes.

- [ ] **Step 3: Write Training Jobs pages**

`training-jobs/index.mdx` — lede + "Runtimes" intro.
`training-jobs/runtimes.mdx` — the runtimes table.
`training-jobs/submitting-a-job.mdx` — the steps list.
`training-jobs/lifecycle.mdx` — phase table + lifecycle actions + the "active=N, ready<N" warn callout.
`training-jobs/reference.mdx` — every field from the wizard, tabulated.

- [ ] **Step 4: Build and verify all 14 pages render**

```bash
npx docusaurus build --no-minify 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add docs/platform/workbench/{models,endpoints,training-jobs}
git commit -m "docs: convert Workbench Models, Endpoints, Training Jobs from design HTML"
```

---

### Task 15: Tools batch 2 — Pipelines, Sweeps, Compute Profiles, Observability

**Files:**
- Create: `docs/platform/workbench/pipelines/{index,anatomy}.mdx`
- Create: `docs/platform/workbench/sweeps/{index,algorithms}.mdx`
- Create: `docs/platform/workbench/compute-profiles/{index,reference}.mdx`
- Create: `docs/platform/workbench/observability/{index,reference}.mdx`

Source: `<section id="pipelines">`, `<section id="sweeps">`, `<section id="compute-profiles">`, `<section id="observability">`.

- [ ] **Step 1: Write Pipelines pages with PREVIEW callout**

`pipelines/index.mdx`:

```mdx
---
title: Pipelines
description: Multi-step DAGs — ingestion → training → eval → deploy.
---

# Pipelines

:::caution[Preview]
The Pipelines tab is in early access while the underlying orchestrator is finalized. List and detail views are read-only; you can't yet author or run pipelines from the UI. See [troubleshooting](../troubleshooting) for the known limitations.
:::

A pipeline is a named DAG of steps. Each step is a containerized task — a Python function, a script, a shell command — wired with inputs, outputs, and conditions. Pipelines turn one-off scripts into reproducible, schedulable workflows.

See [Anatomy](./anatomy) for the full step model.
```

`pipelines/anatomy.mdx` — the "Anatomy of a pipeline" subsection, expanded.

- [ ] **Step 2: Write Sweeps pages with PREVIEW callout**

`sweeps/index.mdx` — same PREVIEW pattern.
`sweeps/algorithms.mdx` — search-algorithm options.

- [ ] **Step 3: Write Compute Profiles pages**

`compute-profiles/index.mdx` — overview, "Read-only by design" prose, the picking-the-right-profile table.
`compute-profiles/reference.mdx` — the `kv` definition list as a markdown table.

- [ ] **Step 4: Write Observability pages**

`observability/index.mdx` — KPI strip overview + the three charts.
`observability/reference.mdx` — full KPI list with definitions, time-range options.

- [ ] **Step 5: Build and verify**

```bash
npx docusaurus build --no-minify 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add docs/platform/workbench/{pipelines,sweeps,compute-profiles,observability}
git commit -m "docs: convert Workbench Pipelines/Sweeps/Compute-Profiles/Observability from design HTML"
```

---

## Phase 5: Link rewrite + sidebar + plugin config

### Task 16: One-shot link rewrite over all moved markdown

**Files:**
- Create: `scripts/migrate-doc-links.js`

- [ ] **Step 1: Write the rewrite script**

```javascript
// scripts/migrate-doc-links.js — one-shot rewrite. Delete after running.
//
// Walks docs/, rewrites old plugin paths to new IA paths in every
// .md/.mdx file. See spec § Migration mechanics step 5.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'docs');

// Order matters: rewrite the more-specific paths first.
const RULES = [
  [/\(\/platform\/notebooks\//g,        '(/platform/workbench/sessions/notebooks/'],
  [/\(\/platform\/remote-desktops\//g,  '(/platform/workbench/sessions/remote-desktops/'],
  [/\(\/platform\/jobs\//g,             '(/platform/jobs/'],
  [/\(\/platform\/storage\//g,          '(/platform/storage/'],
  [/\(\/platform\/(?=clusters|compute-providers|federations|iam|teams|licenses)/g, '(/platform/'],
  [/\(\/getting-started\//g,            '(/get-started/'],
  [/\(\/cli\//g,                        '(/reference/cli/'],
  [/\(\/sdk\//g,                        '(/reference/sdk/'],
  [/\(\/api\//g,                        '(/reference/api/'],
  // href= form (HTML-in-MDX)
  [/href="\/platform\/notebooks\//g,        'href="/platform/workbench/sessions/notebooks/'],
  [/href="\/platform\/remote-desktops\//g,  'href="/platform/workbench/sessions/remote-desktops/'],
  [/href="\/platform\/jobs\//g,             'href="/platform/jobs/'],
  [/href="\/platform\/storage\//g,          'href="/platform/storage/'],
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
```

- [ ] **Step 2: Run it**

```bash
node scripts/migrate-doc-links.js
```

Expected: a list of `rewrote:` lines and a final `rewrote N files` summary.

- [ ] **Step 3: Spot-check with grep**

```bash
grep -rn "/platform/jobs" docs/ || echo "OK: no leftover old paths"
grep -rn "/getting-started" docs/ || echo "OK: no leftover old getting-started paths"
```

Both should print `OK: ...`. (Note: these greps are positive — `grep` exits non-zero when nothing matches, so the `|| echo` will fire.)

- [ ] **Step 4: Commit the rewrites + the script**

```bash
git add docs scripts/migrate-doc-links.js
git commit -m "docs: rewrite internal links to new IA paths"
```

- [ ] **Step 5: Delete the migration script (it has done its job)**

```bash
git rm scripts/migrate-doc-links.js
git commit -m "docs: remove one-shot link migration script"
```

---

### Task 17: Replace sidebars-main.js with the new shape

**Files:**
- Modify (full rewrite): `sidebars-main.js`

- [ ] **Step 1: Replace the file**

```javascript
/**
 * Unified sidebar for all of Vantage docs.
 *
 * Tree shape per spec:
 *   GET STARTED · CONCEPTS · PRODUCTS · PLATFORM · REFERENCE · ABOUT
 *
 * Items are mostly autogenerated from the directory tree; section
 * headers are hand-pinned so they group consistently.
 */

module.exports = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Get started',
      collapsible: true,
      collapsed: false,
      link: {type: 'doc', id: 'get-started/index'},
      items: [{type: 'autogenerated', dirName: 'get-started'}],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'concepts/index'},
      items: [{type: 'autogenerated', dirName: 'concepts'}],
    },
    {
      type: 'html',
      value: '<div class="sidebar-section-label">Products</div>',
      defaultStyle: true,
    },
    {
      type: 'category',
      label: 'Jobs',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'products/jobs/index'},
      items: [{type: 'autogenerated', dirName: 'products/jobs'}],
    },
    {
      type: 'category',
      label: 'Storage',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'products/storage/index'},
      items: [{type: 'autogenerated', dirName: 'products/storage'}],
    },
    {
      type: 'category',
      label: 'Workbench',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'products/workbench/index'},
      items: [{type: 'autogenerated', dirName: 'products/workbench'}],
    },
    {
      type: 'html',
      value: '<div class="sidebar-section-label">Platform</div>',
      defaultStyle: true,
    },
    {
      type: 'category',
      label: 'Clusters',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'platform/clusters/index'},
      items: [{type: 'autogenerated', dirName: 'platform/clusters'}],
    },
    {
      type: 'category',
      label: 'Compute providers',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'platform/compute-providers/index'},
      items: [{type: 'autogenerated', dirName: 'platform/compute-providers'}],
    },
    {
      type: 'category',
      label: 'Federations',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'platform/federations/index'},
      items: [{type: 'autogenerated', dirName: 'platform/federations'}],
    },
    {
      type: 'category',
      label: 'IAM',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'platform/iam/index'},
      items: [{type: 'autogenerated', dirName: 'platform/iam'}],
    },
    {
      type: 'category',
      label: 'Teams',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'platform/teams/index'},
      items: [{type: 'autogenerated', dirName: 'platform/teams'}],
    },
    {
      type: 'category',
      label: 'Licenses',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'platform/licenses/index'},
      items: [{type: 'autogenerated', dirName: 'platform/licenses'}],
    },
    {
      type: 'html',
      value: '<div class="sidebar-section-label">Reference</div>',
      defaultStyle: true,
    },
    {
      type: 'category',
      label: 'CLI',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'reference/cli/index'},
      items: [{type: 'autogenerated', dirName: 'reference/cli'}],
    },
    {
      type: 'category',
      label: 'SDK',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'reference/sdk/index'},
      items: [{type: 'autogenerated', dirName: 'reference/sdk'}],
    },
    {
      type: 'category',
      label: 'API',
      collapsible: true,
      collapsed: true,
      link: {type: 'doc', id: 'reference/api/index'},
      items: [{type: 'autogenerated', dirName: 'reference/api'}],
    },
    {
      type: 'html',
      value: '<div class="sidebar-section-label">About</div>',
      defaultStyle: true,
    },
    {type: 'doc', id: 'changelog'},
    {type: 'doc', id: 'support'},
    {type: 'doc', id: 'glossary'},
  ],
};
```

- [ ] **Step 2: Add the section-label CSS**

Append to `src/css/custom.css`:

```css
/* ── Sidebar section labels (Products / Platform / Reference / About) ─ */
.sidebar-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-400);
  padding: 14px 12px 6px;
  margin-top: 8px;
  border-top: 1px solid var(--ink-100);
}
.menu > .menu__list > li:first-child .sidebar-section-label,
.theme-doc-sidebar-menu > li:first-child .sidebar-section-label {
  border-top: 0;
  margin-top: 0;
}
```

- [ ] **Step 3: Build and confirm sidebar renders**

```bash
node scripts/sync-cli-docs.js /reference/cli/
npx docusaurus build --no-minify 2>&1 | tail -10
```

Expected: SUCCESS. Open `build/index.html` in a browser and confirm the sidebar shows GET STARTED / CONCEPTS / PRODUCTS / PLATFORM / REFERENCE / ABOUT in that order.

- [ ] **Step 4: Commit**

```bash
git add sidebars-main.js src/css/custom.css
git commit -m "docs: rewrite sidebar to CoreWeave-shaped tree with section labels"
```

---

### Task 18: Remove the four plugin instances + the breadcrumb dropdown

**Files:**
- Modify: `docusaurus.config.js`
- Modify: `src/theme/DocBreadcrumbs/index.tsx`

- [ ] **Step 1: Edit `docusaurus.config.js`**

Delete these blocks from the `plugins` array (lines may differ slightly — match by `id:`):

- `id: 'platform'`
- `id: 'cli'`
- `id: 'api'`
- `id: 'sdk'`

Keep `@docusaurus/plugin-ideal-image` and `docusaurus-plugin-llms`.

- [ ] **Step 2: Update navbar — remove the centered title**

In `themeConfig.navbar`, remove the `title:` field (or set `title: ''`). The logo on the left replaces the centered title. The corresponding CSS in `src/css/custom.css` (the `.navbar__title` absolute-positioning block) can stay — it'll be a no-op when title is empty.

- [ ] **Step 3: Edit `src/theme/DocBreadcrumbs/index.tsx`**

Delete the `DocumentationDropdown` function (lines 17-76 of the current file) and remove the `<DocumentationDropdown />` mount on line 223. The remaining file is the swizzled breadcrumbs without the section dropdown.

- [ ] **Step 4: Delete the dropdown's CSS rules**

In `src/css/custom.css`, search for `.breadcrumb-dropdown`, `.breadcrumb-nav-dropdown`, `.breadcrumb-dropdown-toggle` and delete those rule blocks. (They become dead code once the component is removed.)

- [ ] **Step 5: Build to confirm nothing breaks**

```bash
node scripts/sync-cli-docs.js /reference/cli/
npx docusaurus build --no-minify 2>&1 | tail -10
```

Expected: SUCCESS.

- [ ] **Step 6: Commit**

```bash
git add docusaurus.config.js src/theme/DocBreadcrumbs/index.tsx src/css/custom.css
git commit -m "docs: collapse four plugin instances into one + remove breadcrumb section dropdown"
```

---

## Phase 6: Page-header chrome (placeholders)

### Task 19: AskAIButton component

**Files:**
- Create: `src/components/AskAIButton/index.tsx`
- Create: `src/components/AskAIButton/styles.module.css`

- [ ] **Step 1: Write the component**

```tsx
// src/components/AskAIButton/index.tsx
import React, {useState} from 'react';
import styles from './styles.module.css';

export default function AskAIButton(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog">
        <svg
          className={styles.spark}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2">
          <path d="M12 3l1.9 5.7L19.6 10l-5.7 1.3L12 17l-1.9-5.7L4.4 10l5.7-1.3z" />
        </svg>
        <span>Ask AI</span>
      </button>
      {open && (
        <div className={styles.popover} role="dialog">
          <div className={styles.popoverTitle}>Coming soon</div>
          <div className={styles.popoverBody}>
            The docs AI is being trained. Check back soon — or use the search box for now.
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write the styles**

```css
/* src/components/AskAIButton/styles.module.css */
.wrap { position: relative; display: inline-flex; }

.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px 5px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.24);
}

.spark { color: #c7d2fe; }

.popover {
  position: absolute; top: calc(100% + 6px); right: 0;
  width: 280px;
  background: #fff;
  border: 1px solid var(--ink-100);
  border-radius: 8px;
  box-shadow: var(--shadow-pop);
  padding: 12px 14px;
  font-size: 13px;
  color: var(--ink-700);
  z-index: 1000;
}
.popoverTitle { font-weight: 700; color: var(--ink-900); margin-bottom: 4px; }
.popoverBody { line-height: 1.5; }

[data-theme='dark'] .popover {
  background: var(--ifm-background-surface-color);
  border-color: var(--ink-100);
  color: var(--ink-700);
}
```

- [ ] **Step 3: Mount the button in the navbar swizzle**

Edit `src/theme/Navbar/index.tsx` (or `index.js`). Locate where the navbar's right-side items render and inject `<AskAIButton />` after the search component but before the theme toggle. If the file structure isn't obvious, search for `DocSearch` or `colorModeToggle` to find the right anchor.

If the swizzled Navbar doesn't render right-side items inline (it composes `<NavbarLayout>` from sub-components), the cleanest insertion point is `themeConfig.navbar.items` in `docusaurus.config.js`:

```js
items: [
  {type: 'search', position: 'right'},
  {
    type: 'custom-askAI',
    position: 'right',
  },
],
```

Then register the custom navbar item by swizzling `@theme/NavbarItem/ComponentTypes`:

```bash
mkdir -p src/theme/NavbarItem
```

Create `src/theme/NavbarItem/ComponentTypes.js`:

```js
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import AskAIButton from '@site/src/components/AskAIButton';

export default {
  ...ComponentTypes,
  'custom-askAI': AskAIButton,
};
```

- [ ] **Step 4: Build and verify**

```bash
node scripts/sync-cli-docs.js /reference/cli/
npx docusaurus build --no-minify 2>&1 | tail -5
```

Open the build, confirm the "Ask AI" pill renders in the navbar and clicking it shows the "Coming soon" popover.

- [ ] **Step 5: Commit**

```bash
git add src/components/AskAIButton src/theme/NavbarItem docusaurus.config.js
git commit -m "feat(docs): Ask AI navbar button (placeholder, no backend)"
```

---

### Task 20: Restyle the Algolia search button as a pill

**Files:**
- Modify: `src/css/custom.css`

- [ ] **Step 1: Add the search-pill rules**

Append to `src/css/custom.css` (the `.DocSearch-Button` rules already present can be replaced — this is the new shape):

```css
/* ── Algolia search pill (CoreWeave-style rounded pill in navbar) ─ */
.DocSearch-Button,
button.DocSearch-Button {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  height: 34px !important;
  min-width: 320px !important;
  padding: 0 14px !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 999px !important;
  color: var(--iris-100) !important;
  font: inherit !important;
  font-size: 13px !important;
}

.DocSearch-Button:hover {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.24) !important;
}

.DocSearch-Button-Container {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  flex: 1;
}

.DocSearch-Button-Placeholder {
  flex: 1 !important;
  text-align: left !important;
  color: var(--iris-100) !important;
  font-weight: 400 !important;
}

.DocSearch-Button-Keys {
  background: rgba(255, 255, 255, 0.10) !important;
  border-radius: 4px !important;
  padding: 1px 6px !important;
}

.DocSearch-Button-Key {
  background: transparent !important;
  box-shadow: none !important;
  color: #fff !important;
  font-family: var(--ifm-font-family-monospace) !important;
  font-size: 11px !important;
  margin: 0 !important;
  padding: 0 !important;
}

@media (max-width: 800px) {
  .DocSearch-Button { min-width: 0 !important; padding: 0 10px !important; }
  .DocSearch-Button-Placeholder { display: none !important; }
}
```

- [ ] **Step 2: Build and verify**

```bash
npx docusaurus build --no-minify 2>&1 | tail -3
```

Inspect the navbar in the built output: the search trigger should be a wide rounded pill on the left of the navbar items, with "Search Vantage docs..." placeholder and a `⌘K` keys group on the right.

- [ ] **Step 3: Commit**

```bash
git add src/css/custom.css
git commit -m "feat(docs): restyle Algolia search button as a pill"
```

---

### Task 21: ProductIcon component (used by the page header + Workbench section icons)

**Files:**
- Create: `src/components/ProductIcon/index.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/ProductIcon/index.tsx
//
// Tiny SVG icon set for product/tool headers. Shapes lifted from the
// Vantage AI Workbench design's section-header icons.
import React from 'react';

type IconName =
  | 'workbench' | 'sessions' | 'models' | 'endpoints'
  | 'training-jobs' | 'pipelines' | 'sweeps'
  | 'compute-profiles' | 'observability'
  | 'jobs' | 'storage' | 'clusters'
  | 'compute-providers' | 'federations' | 'iam' | 'teams' | 'licenses';

const PATHS: Record<IconName, React.ReactNode> = {
  workbench: <><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></>,
  sessions: <><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M9 9h6M9 13h4"/></>,
  models: <><path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3 8l9 5 9-5M12 13v9"/></>,
  endpoints: <><path d="M4 12h6l3 8 4-16 3 8h0"/></>,
  'training-jobs': <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></>,
  pipelines: <><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M8.5 6h4M8.5 18h4M12.5 6c0 6 3 6 3 6M12.5 18c0-6 3-6 3-6"/></>,
  sweeps: <><path d="M3 17l4-8 4 4 4-10 4 6 2-2"/></>,
  'compute-profiles': <><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/></>,
  observability: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 4-8"/></>,
  jobs: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  storage: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></>,
  clusters: <><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h6M9 18h6M6 9v6M18 9v6"/></>,
  'compute-providers': <><path d="M21 8a4 4 0 0 0-7-3 5 5 0 0 0-9 2 4 4 0 0 0 1 8h13a3 3 0 0 0 2-7z"/></>,
  federations: <><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 7l4 3M18 7l-4 3M6 17l4-3M18 17l-4-3"/></>,
  iam: <><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/></>,
  teams: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4 4 0 0 1 7-3"/></>,
  licenses: <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 11h10M7 15h6"/></>,
};

export default function ProductIcon({
  name,
  size = 24,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductIcon
git commit -m "feat(docs): ProductIcon component for product/tool header icons"
```

---

### Task 22: CopyMcpServerButton component

**Files:**
- Create: `src/components/CopyMcpServerButton/index.tsx`
- Create: `src/components/CopyMcpServerButton/styles.module.css`

- [ ] **Step 1: Write the component**

```tsx
// src/components/CopyMcpServerButton/index.tsx
import React, {useState} from 'react';
import styles from './styles.module.css';

const PLACEHOLDER_CONFIG = `# Vantage Docs MCP server — coming soon\n# This will produce a config snippet you can paste into Claude Desktop, Cursor, etc.\n`;

export default function CopyMcpServerButton(): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PLACEHOLDER_CONFIG);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable in some contexts; ignore
    }
  };

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleCopy}
      aria-label="Copy Vantage Docs MCP server config">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={styles.icon}>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span>{copied ? 'Copied (preview)' : 'Copy MCP Server'}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={styles.chev}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 2: Write the styles**

```css
/* src/components/CopyMcpServerButton/styles.module.css */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 8px 7px 14px;
  background: var(--ifm-background-surface-color);
  border: 1px solid var(--ink-200);
  border-radius: 8px;
  color: var(--ink-900);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}

.btn:hover {
  border-color: var(--iris-300);
  background: var(--iris-50);
  color: var(--iris-700);
}

.icon { color: var(--ink-500); }
.btn:hover .icon { color: var(--iris-600); }

.chev {
  color: var(--ink-400);
  margin-left: 2px;
  padding-left: 6px;
  border-left: 1px solid var(--ink-100);
  height: 16px;
  width: auto;
}
.btn:hover .chev { color: var(--iris-600); }

[data-theme='dark'] .btn {
  background: var(--ifm-background-surface-color);
  border-color: var(--ink-200);
  color: var(--ink-900);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CopyMcpServerButton
git commit -m "feat(docs): Copy MCP Server button (placeholder, copies stub config)"
```

---

### Task 23: FloatingAskWidget component + Root mount

**Files:**
- Create: `src/components/FloatingAskWidget/index.tsx`
- Create: `src/components/FloatingAskWidget/styles.module.css`
- Create: `src/theme/Root.js`

- [ ] **Step 1: Write the component**

```tsx
// src/components/FloatingAskWidget/index.tsx
import React, {useState} from 'react';
import styles from './styles.module.css';

export default function FloatingAskWidget(): React.JSX.Element {
  const [hint, setHint] = useState(false);

  return (
    <div className={styles.wrap}>
      <form
        className={styles.bar}
        onSubmit={(e) => {
          e.preventDefault();
          setHint(true);
          setTimeout(() => setHint(false), 2400);
        }}>
        <input
          className={styles.input}
          type="text"
          placeholder="Ask a question..."
          aria-label="Ask the docs"
        />
        <kbd className={styles.kbd}>⌘I</kbd>
        <button type="submit" className={styles.send} aria-label="Submit question">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="6 11 12 5 18 11" />
          </svg>
        </button>
      </form>
      {hint && (
        <div className={styles.hint} role="status">Coming soon — the docs AI is being trained.</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write the styles**

```css
/* src/components/FloatingAskWidget/styles.module.css */
.wrap {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

@media (max-width: 768px) { .wrap { display: none; } }

.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 480px;
  max-width: calc(100vw - 48px);
  padding: 8px 8px 8px 16px;
  background: var(--ifm-background-surface-color);
  border: 1px solid var(--ink-200);
  border-radius: 999px;
  box-shadow: var(--shadow-pop);
}

.input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  font: inherit;
  font-size: 14px;
  color: var(--ink-900);
}
.input::placeholder { color: var(--ink-400); }

.kbd {
  background: var(--ink-50);
  color: var(--ink-400);
  border: 1px solid var(--ink-100);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 11px;
  font-family: var(--ifm-font-family-monospace);
}

.send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: var(--iris-500);
  color: #fff;
  cursor: pointer;
  transition: background .15s;
}
.send:hover { background: var(--iris-600); }

.hint {
  background: var(--ink-900);
  color: #fff;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  box-shadow: var(--shadow-pop);
}

[data-theme='dark'] .bar {
  background: var(--ifm-background-surface-color);
  border-color: var(--ink-200);
}
```

- [ ] **Step 3: Mount in Root.js swizzle**

```js
// src/theme/Root.js — site-wide wrapper. Mounts the floating ask widget.
import React from 'react';
import FloatingAskWidget from '@site/src/components/FloatingAskWidget';

export default function Root({children}) {
  return (
    <>
      {children}
      <FloatingAskWidget />
    </>
  );
}
```

- [ ] **Step 4: Build and verify**

```bash
node scripts/sync-cli-docs.js /reference/cli/
npx docusaurus build --no-minify 2>&1 | tail -3
```

Confirm the floating bar appears bottom-right on every page and submitting it shows the "Coming soon" hint.

- [ ] **Step 5: Commit**

```bash
git add src/components/FloatingAskWidget src/theme/Root.js
git commit -m "feat(docs): floating Ask widget mounted site-wide (placeholder)"
```

---

### Task 24: DocItem/Layout swizzle — page-header chrome with Copy MCP button

**Files:**
- Create: `src/theme/DocItem/Layout/index.tsx`
- Create: `src/theme/DocItem/Layout/styles.module.css`

- [ ] **Step 1: Write the swizzled layout**

```tsx
// src/theme/DocItem/Layout/index.tsx
//
// Wraps the original DocItem layout to inject a page header (title +
// description + Copy MCP Server button) above the standard content.
// Title/description come from the doc's frontmatter.
import React from 'react';
import OriginalLayout from '@theme-original/DocItem/Layout';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import CopyMcpServerButton from '@site/src/components/CopyMcpServerButton';
import styles from './styles.module.css';

export default function LayoutWrapper(props: any): React.JSX.Element {
  const {metadata, frontMatter} = useDoc();
  const title = (frontMatter as any).title ?? metadata.title;
  const description = (frontMatter as any).description ?? metadata.description ?? '';

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.desc}>{description}</p> : null}
        </div>
        <div className={styles.actions}>
          <CopyMcpServerButton />
        </div>
      </header>
      <OriginalLayout {...props} />
    </>
  );
}
```

- [ ] **Step 2: Write the styles**

```css
/* src/theme/DocItem/Layout/styles.module.css */
.pageHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 0 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--ink-100);
}

.titleBlock { flex: 1; min-width: 0; }

.title {
  font-size: 38px;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-weight: 700;
  color: var(--ink-900);
  margin: 0 0 8px;
}

.desc {
  font-size: 16px;
  color: var(--ink-500);
  margin: 0;
  line-height: 1.55;
  max-width: 70ch;
}

.actions {
  flex-shrink: 0;
  margin-top: 6px;
}

@media (max-width: 800px) {
  .pageHeader { flex-direction: column; align-items: stretch; }
  .actions { align-self: flex-start; }
  .title { font-size: 28px; }
}
```

- [ ] **Step 3: Hide the markdown's first H1 (since we render it ourselves)**

Append to `src/css/custom.css`:

```css
/* DocItem layout renders the H1 from frontmatter; hide the markdown body's
   first H1 to avoid duplication. */
.theme-doc-markdown article > div > header > h1:first-child,
.theme-doc-markdown > article > h1:first-of-type,
.markdown > h1:first-child {
  display: none;
}
```

- [ ] **Step 4: Build + verify**

```bash
npx docusaurus build --no-minify 2>&1 | tail -3
```

Open any doc page in the build (e.g., `build/platform/workbench/index.html`) — confirm the page header shows the title + description on the left, the Copy MCP button on the right, and the body H1 is not duplicated.

- [ ] **Step 5: Commit**

```bash
git add src/theme/DocItem src/css/custom.css
git commit -m "feat(docs): page-header chrome via DocItem/Layout swizzle"
```

---

## Phase 7: Final cleanup + verification

### Task 25: Strict-mode build to catch any missed link

**Files:**
- Modify (temporary): `docusaurus.config.js`

- [ ] **Step 1: Set onBrokenLinks to 'throw' temporarily**

In `docusaurus.config.js`, change:

```js
onBrokenLinks: 'warn',
onBrokenAnchors: 'warn',
```

to:

```js
onBrokenLinks: 'throw',
onBrokenAnchors: 'warn',  // keep at warn — pre-existing /#quick-start is OK to leave
```

- [ ] **Step 2: Run a strict build**

```bash
node scripts/sync-cli-docs.js /reference/cli/
npx docusaurus build --no-minify 2>&1 | tail -40
```

If it throws with broken-link errors, fix each link in its source file, then re-run. Iterate until SUCCESS.

- [ ] **Step 3: Restore to 'warn'**

```js
onBrokenLinks: 'warn',
onBrokenAnchors: 'warn',
```

- [ ] **Step 4: Commit any link fixes (and the temporary config flip if it left footprints)**

```bash
git add -A
git commit -m "docs: fix internal links surfaced by strict-mode build"
```

---

### Task 26: Smoke test — visit every top-level URL

- [ ] **Step 1: Build and serve**

```bash
node scripts/sync-cli-docs.js /reference/cli/
npx docusaurus build
yarn serve &
sleep 3
```

- [ ] **Step 2: cURL each top-level URL — expect 200**

```bash
for path in / get-started concepts \
  products/jobs products/storage products/workbench \
  products/workbench/sessions products/workbench/models \
  products/workbench/endpoints products/workbench/training-jobs \
  products/workbench/pipelines products/workbench/sweeps \
  products/workbench/compute-profiles products/workbench/observability \
  platform/clusters platform/compute-providers platform/federations \
  platform/iam platform/teams platform/licenses \
  reference/cli reference/sdk reference/api \
  changelog support glossary; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/$path)
  printf "%-50s %s\n" "/$path" "$code"
done
```

Expected: every line ends in `200`.

- [ ] **Step 3: Stop the serve process**

```bash
kill %1
```

- [ ] **Step 4: If any 404s, fix them and re-run from Step 1**

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A
git diff --cached --quiet || git commit -m "docs: fix smoke-test URL gaps"
```

---

### Task 27: Delete superseded migration script + final pass

- [ ] **Step 1: Confirm `scripts/transform-cli-links.js` is no longer referenced**

```bash
grep -rn "transform-cli-links" justfile docusaurus.config.js scripts/ || echo "OK"
```

Expected: `OK`.

- [ ] **Step 2: Delete it**

```bash
git rm scripts/transform-cli-links.js
```

- [ ] **Step 3: One last build to confirm green**

```bash
node scripts/sync-cli-docs.js /reference/cli/
npx docusaurus build 2>&1 | tail -5
```

Expected: `[SUCCESS] Generated static files in "build".`

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: remove superseded transform-cli-links script"
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Plan task |
|---|---|
| Plugin / route topology | Task 18 |
| Directory layout | Tasks 4–8 |
| Per-product sub-structure (Diátaxis stubs) | Task 11 |
| Sidebar shape | Task 17 |
| CLI submodule sync | Tasks 1–3 |
| Migration step 5 (link rewrite) | Task 16 |
| `DocumentationDropdown` removal | Task 18 step 3 |
| Workbench MDX conversion | Tasks 12–15 |
| Concepts/changelog/support/glossary stubs | Tasks 9–10 |
| Page-header chrome (Ask AI) | Task 19 |
| Page-header chrome (Algolia pill) | Task 20 |
| Page-header chrome (ProductIcon) | Task 21 |
| Page-header chrome (Copy MCP) | Task 22 |
| Page-header chrome (Floating Ask) | Task 23 |
| Page-header chrome (DocItem swizzle) | Task 24 |
| Strict-mode build | Task 25 |
| Smoke test acceptance | Task 26 |
| Removal of `transform-cli-links.js` | Task 27 |

All spec sections have at least one task. No gaps found.

**Placeholder scan:** none ("TBD"/"TODO"/"implement later" not present in any task).

**Type consistency:** `AskAIButton`, `CopyMcpServerButton`, `FloatingAskWidget`, `ProductIcon` are referenced consistently. The `useDoc()` hook from `@docusaurus/plugin-content-docs/client` is imported once in Task 24 — matches Docusaurus 3.10's API.

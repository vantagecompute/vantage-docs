# Vantage Docs Reorganization — CoreWeave-Shaped IA

**Status:** Approved · drafted 2026-04-29
**Owner:** james@vantagecompute.ai
**Reference:** [docs.coreweave.com](https://docs.coreweave.com/) (sitemap-derived structure)

---

## Goal

Replace the current four-plugin Docusaurus layout (`/`, `/platform`, `/cli`, `/sdk`, `/api` — each with its own isolated sidebar, surfaced via a breadcrumb dropdown) with a single cohesive docs site that mirrors CoreWeave's information architecture: one unified left sidebar, top-level branches for Get Started / Concepts / Products / Platform / Reference, and a strong intra-product convention.

Includes lifting the Vantage AI Workbench User Guide design (from `vantage-kubeflow-integration` design bundle) into a new `products/workbench/` tree as the host for the AI/ML workspace docs.

## Non-goals

- Adding redirects from old URLs. **Clean break** — external links to old paths will 404.
- Resolving content overlaps that *aren't* structural (e.g., how Notebooks doc prose integrates with the Workbench User Guide prose — that's a content-pass task, not this reorg).
- Restyling the site. The design system from `src/css/custom.css` is unchanged. Per-product page templates stay as-is.
- Changing the CLI submodule's source-of-truth: it stays in `external/vantage-cli/` and is consumed via a build-time copy, not vendored.

---

## Decisions locked

| # | Decision | Choice |
|---|---|---|
| 1 | Restructuring intensity | **C (heavy)** — single sidebar + per-product Diátaxis sub-structure |
| 2 | Old-URL redirects | **None** (clean break) |
| 3 | Products vs Platform split | Products = user surface; Platform = admin/setup surface |
| 4 | Notebooks + Remote desktops placement | **Under Workbench → Sessions** (session is the unifying concept) |
| 5 | Workbench sub-structure | **Tool-first** (matches User Guide) — exception to Diátaxis convention |
| 6 | CLI submodule strategy | Build-time copy from submodule into `docs/reference/cli/` |

## Products vs Platform

| User-facing **Products** | Admin-facing **Platform** |
|---|---|
| Jobs | Clusters |
| Storage | Compute providers |
| Workbench (Sessions, Models, Endpoints, …) | Federations |
| | IAM |
| | Teams |
| | Licenses |

A researcher *runs jobs* and *opens sessions* (product). An admin *creates clusters*, *connects compute-providers*, *manages teams/IAM/licenses* (platform). Federations and clusters are infra topology, not user surfaces.

---

## Plugin / route topology

| Today | After |
|---|---|
| Main `docs/` plugin (root) | Main `docs/` plugin (root, hosts everything) |
| `@docusaurus/plugin-content-docs` id=`platform` → `/platform` | **Removed** — content moves into main plugin |
| `@docusaurus/plugin-content-docs` id=`cli` → `/cli` (reads from `external/vantage-cli/...`) | **Removed** — replaced by build-time copy into `docs/reference/cli/` |
| `@docusaurus/plugin-content-docs` id=`api` → `/api` | **Removed** — content moves into main plugin |
| `@docusaurus/plugin-content-docs` id=`sdk` → `/sdk` | **Removed** — content moves into main plugin |

One Docusaurus plugin = one sidebar. The four plugin entries in `docusaurus.config.js` collapse to zero (the main `presets.classic.docs` carries everything).

## Directory layout

```
docs/
├── index.md                            # landing (kept; cards updated to new URLs)
│
├── get-started/                        # ← lift docs/getting-started/
│   ├── index.md
│   ├── sign-up.md
│   ├── notebook-intro.md
│   ├── create-job-submission-intro.md
│   └── create-cluster-intro.md
│
├── concepts/                           # NEW
│   ├── index.md
│   ├── workspaces.md
│   ├── jobs-and-pipelines.md
│   ├── compute-and-clusters.md
│   └── teams-and-iam.md
│
├── products/
│   ├── jobs/                           # ← lift docs-platform/jobs/  (Diátaxis: tutorials/how-to-guides/reference)
│   ├── storage/                        # ← lift docs-platform/storage/  (Diátaxis)
│   └── workbench/                      # ← NEW (sourced from Workbench User Guide design)
│       ├── index.md                    # overview
│       ├── get-started.md              # 5-step quickstart
│       ├── concepts.md                 # workspace · compute profile · lifecycle · cost · observability
│       ├── sessions/
│       │   ├── index.md                # what a session is (unifying concept)
│       │   ├── creating-a-session.md
│       │   ├── lifecycle.md
│       │   ├── notebooks/              # ← lift docs-platform/notebooks/
│       │   │   ├── index.md
│       │   │   ├── tutorials/
│       │   │   └── how-to-guides/
│       │   ├── remote-desktops/        # ← lift docs-platform/remote-desktops/
│       │   │   ├── index.md
│       │   │   └── tutorials/
│       │   └── reference.md
│       ├── models/
│       │   ├── index.md
│       │   ├── registering-a-model.md
│       │   └── reference.md
│       ├── endpoints/
│       │   ├── index.md
│       │   ├── predictive-vs-llm.md
│       │   ├── deploying.md
│       │   ├── autoscaling.md
│       │   ├── canary-rollouts.md
│       │   └── reference.md
│       ├── training-jobs/
│       │   ├── index.md
│       │   ├── runtimes.md
│       │   ├── submitting-a-job.md
│       │   ├── lifecycle.md
│       │   └── reference.md
│       ├── pipelines/                  # PREVIEW callout in index
│       │   ├── index.md
│       │   └── anatomy.md
│       ├── sweeps/                     # PREVIEW callout in index
│       │   ├── index.md
│       │   └── algorithms.md
│       ├── compute-profiles/
│       │   ├── index.md
│       │   └── reference.md
│       ├── observability/
│       │   ├── index.md
│       │   └── reference.md
│       ├── shortcuts.md
│       └── troubleshooting.md
│
├── platform/
│   ├── clusters/                       # ← lift docs-platform/clusters/
│   ├── compute-providers/              # ← lift docs-platform/compute-providers/
│   ├── federations/                    # ← lift docs-platform/federations/
│   ├── iam/                            # ← lift docs-platform/iam/
│   ├── teams/                          # ← lift docs-platform/teams/
│   └── licenses/                       # ← lift docs-platform/licenses/
│
├── reference/
│   ├── cli/                            # ← copied from external/vantage-cli at build (gitignored)
│   ├── sdk/                            # ← lift docs-sdk/
│   └── api/                            # ← lift docs-api/
│
├── changelog.md                        # NEW (stub)
├── support.md                          # NEW (stub linking to slack/contact)
└── glossary.md                         # NEW (stub seeded from Workbench User Guide glossary)
```

After moves: `docs-platform/`, `docs-sdk/`, `docs-api/`, `docs/getting-started/` no longer exist. The `external/vantage-cli/` submodule is unchanged — it's *read* by a sync script.

## Per-product sub-structure rules

Each product is one of two shapes:

**Shape 1 — Diátaxis** (used by `products/jobs/`, `products/storage/`, all `platform/*/`):

```
<area>/
├── index.md          # overview / "about"
├── get-started.md    # first-time tutorial (single page)
├── tutorials/        # long-form walkthroughs
├── how-to-guides/    # task-oriented recipes
└── reference/        # fields, schemas, configs
```

Empty branches get a stub `index.md` with a "coming soon" callout — the sidebar stays consistent and we don't 404 on the directory link.

**Shape 2 — Tool/sub-product hub** (used by `products/workbench/`):

A product whose surface is a set of named tools (8, in Workbench's case) or sub-products (notebooks, remote-desktops under `sessions/`). Each tool gets its own sub-folder with overview + lifecycle + reference. No `tutorials/`/`how-to-guides/` split inside the hub — the tool *is* the unit.

The two shapes are explicit per-product; no mixing within a branch.

## Sidebar shape

`sidebars-main.js` becomes a single autogenerated tree with hand-pinned section headers:

```
GET STARTED
  Welcome              → /get-started
  Sign up              → /get-started/sign-up
  Quick: notebook      → /get-started/notebook-intro
  Quick: job           → /get-started/create-job-submission-intro
  Quick: cluster       → /get-started/create-cluster-intro

CONCEPTS
  Overview             → /concepts
  Workspaces           → /concepts/workspaces
  Jobs and pipelines   → /concepts/jobs-and-pipelines
  Compute and clusters → /concepts/compute-and-clusters
  Teams and IAM        → /concepts/teams-and-iam

PRODUCTS
  Jobs                 → /products/jobs            (expands: Overview · Get started · Tutorials · How-to · Reference)
  Storage              → /products/storage         (same)
  Workbench            → /products/workbench
    ├ Overview · Get started · Concepts
    ├ Sessions
    │   ├ Notebooks (Jupyter / VS Code / RStudio)
    │   └ Remote desktops
    ├ Models
    ├ Endpoints
    ├ Training Jobs
    ├ Pipelines               [PREVIEW]
    ├ Sweeps                  [PREVIEW]
    ├ Compute Profiles
    ├ Observability
    ├ Keyboard shortcuts
    └ Troubleshooting

PLATFORM
  Clusters             → /platform/clusters         (Diátaxis expansion)
  Compute providers    → /platform/compute-providers
  Federations          → /platform/federations
  IAM                  → /platform/iam
  Teams                → /platform/teams
  Licenses             → /platform/licenses

REFERENCE
  CLI                  → /reference/cli
  SDK                  → /reference/sdk
  API                  → /reference/api

ABOUT
  Changelog            → /changelog
  Support              → /support
  Glossary             → /glossary
```

PREVIEW pills use the existing `<span class="sb-pill">` class from the Workbench design (already styled in `src/css/custom.css`).

The `DocumentationDropdown` in `src/theme/DocBreadcrumbs/index.tsx` is **deleted** — its job (switching between plugin sandboxes) no longer exists. Breadcrumbs revert to plain Home › Section › Page.

## CLI submodule sync

The CLI is externally maintained at `external/vantage-cli/` and rebuilds from upstream. To get its docs into the unified sidebar without breaking the submodule contract:

**`scripts/sync-cli-docs.js`** — runs before `yarn build`:

1. `rm -rf docs/reference/cli/`
2. Copy `external/vantage-cli/docusaurus/docs/**/*.{md,mdx}` → `docs/reference/cli/`
3. Rewrite intra-CLI links from `/cli/...` → `/reference/cli/...`
4. Rewrite cross-section links to other Vantage docs from absolute paths to the new IA paths (e.g., `/platform/jobs/...` → `/products/jobs/...`).
5. Generate a `_category_.json` so the sidebar autogenerator picks up the right title.

**`docs/reference/cli/` is added to `.gitignore`** — generated, never committed.

The existing `scripts/transform-cli-links.js` already does step 3 for the old plugin-based setup. The new script subsumes it.

## Migration mechanics — ordered steps

1. **Add `scripts/sync-cli-docs.js`** + add `docs/reference/cli/` to `.gitignore`. Run once, verify output renders locally with the existing routing before changing `docusaurus.config.js`.
2. **`git mv` content** to its new location per the directory layout. `git mv` preserves blame:
   - `git mv docs/getting-started docs/get-started`
   - `git mv docs-platform/jobs docs/products/jobs`
   - `git mv docs-platform/storage docs/products/storage`
   - `git mv docs-platform/notebooks docs/products/workbench/sessions/notebooks`
   - `git mv docs-platform/remote-desktops docs/products/workbench/sessions/remote-desktops`
   - `git mv docs-platform/clusters docs/platform/clusters`  *(name preserved)*
   - `git mv docs-platform/compute-providers docs/platform/compute-providers`
   - `git mv docs-platform/federations docs/platform/federations`
   - `git mv docs-platform/iam docs/platform/iam`
   - `git mv docs-platform/teams docs/platform/teams`
   - `git mv docs-platform/licenses docs/platform/licenses`
   - `git mv docs-sdk docs/reference/sdk`
   - `git mv docs-api docs/reference/api`
   - Delete now-empty `docs-platform/`.
3. **Convert `Workbench User Guide.html` to MDX** under `docs/products/workbench/`:
   - One `.mdx` per `<section id="...">` in the source HTML, named per the directory layout above.
   - Inline mock UI shots become `<details>` collapsibles preserving the `mini-tbl` markup.
   - PREVIEW callouts use the existing admonition styles (`<Admonition type="caution" title="Preview">...`).
   - Section-header decorative SVGs become a `<ProductIcon name="...">` MDX component (small new component) so they don't bloat each page.
4. **Add new content stubs**: `concepts/*`, `changelog.md`, `support.md`, `glossary.md`, plus `index.md` stubs in each empty Diátaxis subfolder.
5. **Run a one-shot link rewrite script** over all moved markdown:
   - `/platform/jobs/...` → `/products/jobs/...`
   - `/platform/storage/...` → `/products/storage/...`
   - `/platform/notebooks/...` → `/products/workbench/sessions/notebooks/...`
   - `/platform/remote-desktops/...` → `/products/workbench/sessions/remote-desktops/...`
   - `/platform/{clusters,compute-providers,federations,iam,teams,licenses}/...` → unchanged (still under `/platform/...`)
   - `/cli/...` → `/reference/cli/...`
   - `/sdk/...` → `/reference/sdk/...`
   - `/api/...` → `/reference/api/...`
   - `/getting-started/...` → `/get-started/...`
   - Relative links (`./`, `../`) inside moved files: rewrite based on new file location.
6. **Replace `sidebars-main.js`** with the new shape from the Sidebar section.
7. **Update `docusaurus.config.js`** — remove the four `@docusaurus/plugin-content-docs` plugin entries (platform, cli, api, sdk).
8. **Delete `DocumentationDropdown`** from `src/theme/DocBreadcrumbs/index.tsx` (and the corresponding rule in `custom.css`).
9. **Wire `sync-cli-docs.js` into `justfile`'s `build` recipe** (and `dev` if we want live CLI docs in dev).
10. **Build with `onBrokenLinks: 'throw'` temporarily** — surfaces every missed link rewrite. Fix iteratively until clean. Restore to `'warn'` after.
11. **Smoke check**: visit `/`, `/get-started`, every product index, every platform index, `/reference/cli`, `/reference/sdk`, `/reference/api` — confirm none 404.

## Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Internal links break | High | Step 5 link-rewrite script + step 10 `onBrokenLinks: 'throw'` |
| External links 404 (clean break) | Certainty | Accepted — decision #2 |
| CLI sync produces stale docs in dev | Medium | Sync script runs before `yarn build`; for `yarn start` we run it once at startup |
| Workbench MDX conversion drops content | Medium | Diff each section's `<h*>` and `<p>` count against the source HTML |
| Sidebar gets too long | Low | Use Docusaurus' `collapsed: true` on PRODUCTS and PLATFORM categories by default |

## Out of scope (future work)

- Building the AI Workbench *app* itself. This spec covers only the documentation for it.
- Migrating older platform docs into the new Diátaxis shape where they don't have one. Stubs are accepted for now.
- Top-nav primary categories. Sidebar carries IA; navbar stays minimal (search + theme toggle + brand).
- Algolia DocSearch index facets aligned to the new IA.

## Acceptance criteria

- [ ] One Docusaurus plugin instance backs the entire site (no separate plugin entries for cli/sdk/api/platform).
- [ ] `docs/reference/cli/` is present at build time, absent from git.
- [ ] Every URL in the Sidebar shape resolves with a 200 (verified via the smoke-check step).
- [ ] `Workbench User Guide.html` content is split into the per-page MDX files listed in the directory layout, with no orphan sections.
- [ ] `DocumentationDropdown` is removed from the rendered breadcrumbs.
- [ ] `docusaurus build` passes with `onBrokenLinks: 'warn'` and no warnings on internal links (the pre-existing `/#quick-start` warning may remain or get fixed in passing).

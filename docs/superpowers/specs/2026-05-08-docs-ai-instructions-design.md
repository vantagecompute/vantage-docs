# Design: AI Instructions for Vantage Docs

## Problem

The Vantage documentation site (Docusaurus) has several sections that are stubs or follow an older, more formal style inconsistent with the newer Jobs and Workbench sections. We need a reusable instruction file (`docs-instructions.md`) that AI agents can follow to write docs one section at a time while maintaining consistent tone, structure, and quality.

## Success Criteria

- An AI agent given `docs-instructions.md` + a section name can produce docs that are visually and tonally indistinguishable from the Jobs and Workbench sections
- The instruction file is self-contained (doesn't require reading reference files)
- Sections can be written independently without coordination

## Tone (specified by user)

- **Outcome-first**: Lead with what you can accomplish
- **Conversational**: Short paragraphs, 1 sentence often sufficient
- **Cost-aware**: Surface cost implications of every action
- **Approachable**: Explain HPC jargon inline, don't assume expertise

## Design: docs-instructions.md Structure

### 1. Purpose & How to Use

Brief intro explaining the document's role and how to invoke an AI agent with it.

### 2. Tone & Voice Rules

Extracted from the "done" reference sections (`platform/jobs/`, `platform/workbench/`):

- Outcome-first openings
- Short paragraphs, single-sentence lines
- Plain language with inline jargon explanations
- Cost callouts in tips and concept sections
- `:::tip` / `:::info` for practical guidance
- Tables for structured data (statuses, comparisons, file types)
- Numbered lists for procedures
- No emojis
- No comments in code blocks

### 3. Page Structure Template

Three standard top-level pages per section:
- `index.md` — Overview + "What you'll find inside" + "Next steps"
- `get-started.mdx` — Numbered quickstart (5 min or less)
- `concepts.mdx` — Mental models with explanatory tables

Sub-pages for specific feature areas.

The old "Tutorials / How-to Guides / Reference" subdirectory pattern is retired for new content.

### 4. Section Inventory

Maps each remaining section to:
- Its path in the docs tree
- Relevant app routes (from vantage-ui)
- Key features to cover
- Existing content status (stub, old, empty)

### 5. AI Invocation Template

Reusable prompt with slots for section name, routes, features, and status.

## Reference Analysis

### Done sections (good reference):
- `platform/jobs/index.md` — 25 lines, intro + bullet list + links
- `platform/jobs/get-started.mdx` — 33 lines, numbered quickstart
- `platform/jobs/concepts.mdx` — 37 lines, 4 mental models with tables
- `platform/workbench/index.mdx` — 23 lines, intro + bullet list + info box
- `platform/workbench/get-started.mdx` — 18 lines, numbered quickstart
- `platform/workbench/concepts.mdx` — 36 lines, 5 mental models with tables

### Stub/old sections (need rewrite):
- `concepts/workspaces.md`, `jobs-and-pipelines.md`, `compute-and-clusters.md`, `teams-and-iam.md` — all stubs
- `platform/clusters/` — old formal style
- `platform/compute-providers/` — old verbose style
- `platform/storage/` — old style
- `platform/teams/` — old style
- `platform/licenses/` — old style
- `platform/federations/` — empty

### App route mapping (from vantage-ui exploration):
- Clusters: `/compute/clusters/kubernetes`, `/compute/clusters/slurm`, detail views
- Compute Providers: admin cloud accounts, AWS/Azure/GCP/on-prem/partners
- Storage: cluster detail > Storage tab (PVCs, storage classes)
- Teams: `/teams`, `/admin/users`, `/admin/groups`, `/admin/roles`
- Licenses: `/lm/configurations`, `/lm/inventory`
- Workbench sub-features: mapped to their routes
- Dashboard: workspace picker, quota display, cost envelope

## Files to Create

1. `docs/superpowers/specs/2026-05-08-docs-ai-instructions-design.md` (this file)
2. `/home/b/Development/work/vantage-docs-algolia/docs-instructions.md` (the deliverable)

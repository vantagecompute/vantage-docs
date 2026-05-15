# Vantage Docs: AI Writing Instructions

Use this document to instruct an AI agent to write or rewrite a section of the Vantage Compute documentation. The agent should follow the tone and structure rules below, consult the section appendix for the specific topic, and visit the Vantage UI app at `/home/b/Development/work/vantage-ui/` to observe feature behavior and copy UI labels.

## How to Use

1. Pick a section from the **Section Inventory** below.
2. Tell the AI: "Write the [section name] docs section. Follow the instructions in docs-instructions.md. Reference the style of platform/jobs/ and platform/workbench/. The appendix entry for this section is [section key]."
3. The AI should visit the app routes listed in the appendix to see the actual UI.
4. Review and iterate per section.

Do one section at a time. Sections are independent — no cross-section prerequisites.

## Tone & Voice

These rules are extracted from the reference-quality sections (`platform/jobs/` and `platform/workbench/`). Follow them exactly.

### Outcome-first

Every page's opening sentence tells you what you can *accomplish*, not what the feature is.

**Do this:** "Vantage Jobs is where you define, submit, and track computational work on your clusters."
**Not this:** "Vantage Jobs is a comprehensive job management system for HPC workloads."

**Do this:** "Workbench is where you build, train, and serve machine-learning models on Vantage."
**Not this:** "The Vantage AI Workbench is a machine-learning workspace that provides..."

### Conversational

Write like you're explaining it to a colleague. Short paragraphs, often one sentence. Punchy.

**Do this:** "Archive hides it, delete wipes it."
**Not this:** "The archive function removes resources from the default view while preserving the underlying data and all associated references."

**Do this:** "Five minutes, one job."
**Not this:** "This quickstart guide will walk you through the process of submitting your first job in approximately five minutes."

### Cost-aware

Surface cost implications. Don't let the reader discover them the hard way.

**Do this:** "Stop it when you're done — idle GPUs are billed."
**Do this:** "Idle spend is the most common preventable cost — sessions left open overnight are the usual culprit."
**Do this:** "Every active resource accumulates spend."

### Approachable for non-HPC readers

When HPC terms are necessary, explain them inline in plain language. Don't assume familiarity with Slurm, partitions, PBS, InfiniBand, etc.

**Do this:** "Pick a cluster and a partition (partitions are job queues on a cluster — your admin sets them up)."
**Do this:** "#SBATCH directives tell Slurm what resources the job needs."
**Not this:** "Configure the Slurm partition parameters for job submission."

### Structural rules

- **No emojis** anywhere in any file.
- **No comments** in code blocks or regular content.
- **`:::tip`** for actionable advice (cost tips, time-saving shortcuts, common mistakes).
- **`:::info`** for contextual background (e.g., "Workbench replaces the Kubeflow dashboard").
- **Tables** for structured comparisons: statuses, file types, lifecycle phases, pricing models.
- **Numbered lists** for step-by-step procedures.
- **Bold UI element names** that users click on: "Click **Jobs**", "Click **Create Script**".
- **`<kbd>` tags** for keyboard actions or UI buttons: `<kbd>New session</kbd>`.

### Sentence & paragraph style

- One sentence per line is fine.
- Short paragraphs (1-3 sentences max).
- Don't pad with filler. Every sentence should carry information.
- Use plain English over technical precision when they conflict.

## Page Structure

Each section follows a standard three-page hierarchy, matching the Jobs and Workbench pattern.

### index.md (overview)

```
---
title: <Section Title>
description: <Short description, 10-15 words>
---

# <Section Title>

<One-sentence outcome-first intro>

[Get started](/platform/<section>/get-started) · [Concepts](/platform/<section>/concepts)

## What you'll find inside

- **<Feature A>** — <One sentence description>
- **<Feature B>** — <One sentence description>
- **<Feature C>** — <One sentence description>

## Next steps

- [Quickstart](/platform/<section>/get-started) — <5-word hook>
- [Concepts](/platform/<section>/concepts) — <5-word hook>
```

### get-started.mdx (numbered quickstart)

```
---
title: Get started
description: From <starting point> to <end result> in under five minutes.
---

# Quickstart

<One-line outcome hook, 5-8 words>

1. **<Action>** — <Instruction with bold UI elements>
2. **<Action>** — <Instruction>
3. **<Action>** — <Instruction>
4. **<Action>** — <Instruction>
5. **<Action>** — <Instruction>

:::tip
<Practical advice, often cost-related or a time-saver>
:::
```

5 steps max. Each step is 1-2 sentences. Bold UI elements.

### concepts.mdx (mental models)

```
---
title: Concepts
description: <N> mental models that show up across every <Section> tab.
---

# Concepts

<N> mental models that show up across every <Section> tab.

## <Model 1>

<2-4 sentence explanation>

## <Model 2>

<2-4 sentence explanation>

<table-or-description>
```

3-5 concepts. Use tables for: statuses, phases, file types, comparisons.

### Sub-pages

Each distinct feature area gets its own page. Follow the same tone rules. Depth varies by complexity — a page can be 10 lines or 50 lines. Add `:::tip` callouts where practical.

## Section Inventory

### concepts/workspaces

| Property | Value |
|---|---|
| **Current status** | Stub (10 lines, `:::info coming soon`) |
| **App routes** | Dashboard (home), top-right workspace picker |
| **Key features** | Quota (CPU, memory, GPUs, storage), RBAC scope, cost envelope, workspace picker |
| **Style notes** | Add cross-references to teams-and-iam and compute-and-clusters |

### concepts/compute-and-clusters

| Property | Value |
|---|---|
| **Current status** | Stub |
| **App routes** | `/compute/clusters/kubernetes`, `/compute/clusters/slurm`, cluster detail views |
| **Key features** | Cluster types (Kubernetes, Slurm, Slurm-on-K8s), compute profiles (GPU type, count, autoscaling, instance class), compute providers (AWS, Azure, GCP, on-prem, partners) |

### concepts/jobs-and-pipelines

| Property | Value |
|---|---|
| **Current status** | Stub |
| **App routes** | `/jobs/scripts`, `/jobs/templates`, `/jobs/submissions`, `/jobs/catalog`; `/workbench/pipelines/*` |
| **Key features** | Script → submission → pipeline flow; jobs are finite, pipelines are multi-step DAGs |
| **Style notes** | This is a concepts-level page — keep it brief. Jobs has its own full section. |

### concepts/teams-and-iam

| Property | Value |
|---|---|
| **Current status** | Stub |
| **App routes** | `/teams`, `/admin/users`, `/admin/groups`, `/admin/roles` |
| **Key features** | Team grouping, resource ownership, permission groups, permission roles, RBAC, org-level settings |

### platform/clusters

| Property | Value |
|---|---|
| **Current status** | Old formal style — needs full rewrite |
| **App routes** | `/compute/clusters/kubernetes`, `/compute/clusters/slurm`, `/compute/clusters/prepare-cluster` wizard; detail: overview, nodes, partitions, queue, monitoring, configuration |
| **Key features** | Create cluster wizard, K8s vs Slurm vs Slurm-on-K8s, node groups, namespaces, storage, monitoring |
| **Sub-pages** | Consider: index, get-started, concepts, how-to for add/create |
| **Style notes** | Current text is generic ("Deploy and manage HPC clusters with ease"). Replace with outcome-first language. |

### platform/compute-providers

| Property | Value |
|---|---|
| **Current status** | Old verbose style — needs rewrite |
| **App routes** | Admin > Cloud Accounts |
| **Key features** | AWS, Azure, GCP, on-premises, partner providers (atNorth, BuzzHPC, Cudo Compute, Responsible Compute) |
| **Style notes** | Current index.md is 99 lines of marketing-style prose. Condense hard. Focus on what each provider is *for*, not its general cloud features. |

### platform/storage

| Property | Value |
|---|---|
| **Current status** | Old style — needs rewrite |
| **App routes** | Cluster detail > Storage tab |
| **Key features** | PVCs, storage classes, mounting, cloud vs on-prem vs partner storage |
| **Style notes** | Current is 38 lines of generalities. Replace with specifics. |

### platform/teams

| Property | Value |
|---|---|
| **Current status** | Old style — needs rewrite |
| **App routes** | `/teams` |
| **Key features** | Team CRUD, member management, roles, resource sharing |
| **Style notes** | Current is generic. Make it specific and actionable. |

### platform/licenses

| Property | Value |
|---|---|
| **Current status** | Old verbose style — has substantive content but needs voice rewrite |
| **App routes** | `/lm/configurations`, `/lm/inventory` |
| **Key features** | FlexLM, RLM, LMX, LS-DYNA, DSLS, OLicense; Vantage-hosted vs user-hosted; high availability |
| **Style notes** | This one has real content (how-to guides, tutorials). Focus on rewriting the index and adding get-started/concepts. Keep the how-to pages if they're good. |
| **Sub-pages** | vantage-hosted.md, user-hosted.md |

### platform/federations

| Property | Value |
|---|---|
| **Current status** | Empty (0 lines) |
| **App routes** | Unknown — explore the app UI |
| **Key features** | TBD from app exploration |
| **Style notes** | Start with the standard three-page structure. If the feature is minimal, a single index.md is fine. |

## AI Invocation Template

Copy this template and fill in the bracketed fields:

```
Write the [section name] docs section. Follow these instructions:

TONE: outcome-first, conversational, cost-aware, approachable for non-HPC readers.
  - Lead with what you can accomplish, not what the feature is
  - Short paragraphs, one sentence per line
  - Explain HPC terms inline in plain language
  - Surface cost implications in tips and concept sections

STRUCTURE: Create these files:
  - index.md: overview page (1-2 sentence intro + "What you'll find inside" bullet list + "Next steps")
  - get-started.mdx: numbered quickstart, 5 steps max, under 5 minutes
  - concepts.mdx: 3-5 mental models with tables for structured info
  - Sub-pages for each distinct feature area

CONVENTIONS:
  - No emojis, no comments in code blocks
  - `:::tip` for actionable advice (cost, time-saving)
  - `:::info` for contextual background
  - Use `.mdx` extension if the file uses callouts or JSX syntax
  - Bold UI element names
  - Tables for statuses, comparisons, file types
  - Kebab-case filenames, .md or .mdx extension
  - Frontmatter: title and description required

REFERENCE STYLE: Read platform/jobs/ and platform/workbench/ for the exact tone.

APP ROUTES to visit at /home/b/Development/work/vantage-ui/: [list routes]

KEY FEATURES to cover: [list features]

EXISTING CONTENT: [stub / old style / empty] — [rewrite from scratch / rewrite voice / expand]
```

## Reference Sections

Read these to internalize the tone:

- `docs/platform/jobs/index.md` — Overview page
- `docs/platform/jobs/get-started.mdx` — Quickstart
- `docs/platform/jobs/concepts.mdx` — Concepts
- `docs/platform/workbench/index.mdx` — Overview page
- `docs/platform/workbench/get-started.mdx` — Quickstart
- `docs/platform/workbench/concepts.mdx` — Concepts
- `docs/get-started/sign-up.md` — Step-by-step guide with screenshots

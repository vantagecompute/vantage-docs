# Jobs Section Voice Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite 18 pages in `docs/platform/jobs/` to match the Workbench section's conversational, outcome-first, cost-aware voice — approachable for non-HPC readers.

**Architecture:** Prose rewrites only — structure unchanged, no new files, no sidebar edits. Each page gets a tone, language, and readability pass following the approved design spec at `docs/superpowers/specs/2026-05-08-jobs-voice-rewrite-design.md`.

**Tech Stack:** Markdown/MDX, Docusaurus 3, `just build` for verification, `yarn spellcheck` for spelling.

---

### Task 1: Top-level pages — index, concepts, get-started

**Files:**
- Modify: `docs/platform/jobs/index.md`
- Modify: `docs/platform/jobs/concepts.mdx`
- Modify: `docs/platform/jobs/get-started.mdx`

- [ ] **Step 1: Read all three files**

Read: `docs/platform/jobs/index.md`, `concepts.mdx`, `get-started.mdx`

- [ ] **Step 2: Rewrite `index.md`**

Open with: "Vantage Jobs is where you define, submit, and track computational work on your clusters."

Drop "three primitives" language. Bullet the four sub-sections with 1-sentence outcome descriptions. Keep the same structure (lead + "What you'll find inside" + "Next steps") but rewrite prose.

- [ ] **Step 3: Rewrite `concepts.mdx`**

Reframe from 6 technical sections to 4 broad mental models:
1. **The pipeline** — Template -> Script -> Submission (prose only, no code-block diagram)
2. **Script files** — Entrypoint vs support files (1-2 sentences + simple table)
3. **Archive vs Delete** — Conversational: "Archive hides it, delete wipes it"
4. **Statuses** — Prose descriptions: "CREATED means queued, SUBMITTED means dispatched, DONE means completed, REJECTED and ABORTED mean something went wrong"

Add a cost mention: "Submissions that stay queued longer than expected may indicate a busy cluster — check utilization before the clock runs."

Remove the "File classes" table (redundant with scripts reference). Remove the pipeline code-block diagram.

- [ ] **Step 4: Rewrite `get-started.mdx`**

Keep the numbered steps and the example bash script. Changes:
- Open: "Five minutes, one job." instead of "From a fresh workspace..."
- Step 4: add a brief partition explanation: "Partitions are job queues on a cluster — your admin sets them up"
- Step 5: replace CREATED / SUBMITTED / DONE with "queued" / "running" / "done"
- Add a `:::tip` about queue wait times or the auto-refresh

- [ ] **Step 5: Verify build**

Run: `just build`. Expected: SUCCESS, no errors.

- [ ] **Step 6: Spell check**

Run: `yarn spellcheck`. Expected: no unknown words in changed files.

---

### Task 2: Scripts sub-section — index, creating, managing, reference

**Files:**
- Modify: `docs/platform/jobs/scripts/index.mdx`
- Modify: `docs/platform/jobs/scripts/creating.mdx`
- Modify: `docs/platform/jobs/scripts/managing.mdx`
- Modify: `docs/platform/jobs/scripts/reference.mdx`

- [ ] **Step 1: Read all four files**

Read: all four scripts files.

- [ ] **Step 2: Rewrite `scripts/index.mdx`**

Open with outcome: "Scripts are where you define what runs on the cluster. Each script has a name, a description, an owner, and one or more files. One file is the entrypoint — what actually executes. The rest are support files: configs, modules, data, sub-scripts."

Drop the lifecycle table (Active/Archived/Deleted — redundant with concepts/managing). Replace with 1-2 sentences on what you can do: create from scratch, clone, render from a template, submit.

- [ ] **Step 3: Rewrite `scripts/creating.mdx`**

Convert to `sessions/creating-a-session.mdx` format — conversational wizard walkthrough:
- Walk through the Create Script dialog: "Give it a name, optionally a description, optionally upload files"
- Explain entrypoint auto-creation
- Editor: "Click the pencil icon on any file row to open the built-in editor — syntax highlighting, minimap, the works."
- Drop the "Script files table" table — the columns (Name, Type, Actions) are obvious from the UI
- Drop the "Create Script dialog" table — fold constraints into prose ("Names are unique within your org, max 255 characters")

- [ ] **Step 4: Rewrite `scripts/managing.mdx`**

Follow `sessions/lifecycle.mdx` format. Rewrite the actions table to describe what each action does for you:
- Submit Script: opens the submit dialog
- Clone: creates an independent copy
- Archive: hides from default view, references preserved
- Delete: permanent, references removed

Add `:::tip` about archive vs delete. Add `:::tip` about bulk operations.

- [ ] **Step 5: Rewrite `scripts/reference.mdx`**

Convert to `training-jobs/reference.mdx` style. Replace the "Script fields" table with user-facing field descriptions:
```
ID — Unique numeric identifier
Name — Display name (max 255 chars)
Description — Optional summary (max 255 chars)
Owner — Email of the creator
Created at — ISO 8601 timestamp
Updated at — ISO 8601 timestamp
Archived — Whether hidden from default view
Cloned from — Source script ID, if cloned
Parent template — Template ID, if rendered from a template
Files — Array of script files (entrypoint + support)
```

Keep the "File fields" table but shorter. Drop the "Limits" table — move constraints inline into the descriptions.

- [ ] **Step 6: Verify build**

Run: `just build`. Expected: SUCCESS, no errors.

- [ ] **Step 7: Spell check**

Run: `yarn spellcheck`. Expected: no unknown words.

---

### Task 3: Templates sub-section — index, creating, using, managing, reference

**Files:**
- Modify: `docs/platform/jobs/templates/index.mdx`
- Modify: `docs/platform/jobs/templates/creating.mdx`
- Modify: `docs/platform/jobs/templates/using.mdx`
- Modify: `docs/platform/jobs/templates/managing.mdx`
- Modify: `docs/platform/jobs/templates/reference.mdx`

- [ ] **Step 1: Read all five files**

Read: all five templates files.

- [ ] **Step 2: Rewrite `templates/index.mdx`**

Open with outcome: "Templates let you define a job once and reuse it across your team without everyone needing to understand Slurm syntax."

Move identifier and workflow script details to the creating/reference pages. Keep to: what templates are, why you'd use them (standardization, reduced friction), links to sub-pages.

- [ ] **Step 3: Rewrite `templates/creating.mdx`**

Tone shift. Replace "Create Template Dialog" table with conversational wizard walkthrough of the three fields (name, identifier, description).

Describe file types in prose instead of table:
"Entrypoint Template (.py.j2 or .sh.j2): Rendered into the script entrypoint. Uses Jinja2 syntax.
Support Template: Rendered into a support file. Any filename or extension.
Workflow Script: An optional script the render dialog runs to guide users through variable values interactively."

Replace "Executed by the Vantage CLI" with "Used during the render dialog to..." — less CLI-focused. Add `:::tip` about Jinja2 syntax.

- [ ] **Step 4: Rewrite `templates/using.mdx`**

Already close to target voice. Convert the field list to prose:
"The render dialog asks for a name for the new script (required), a description (optional), parameter values pre-filled from the template defaults, and which template file becomes the entrypoint."

Add `:::warning` about templates not auto-updating rendered scripts. Add a note: "You land on the new script's detail page, ready to submit."

- [ ] **Step 5: Rewrite `templates/managing.mdx`**

Tone shift. Use "you can" instead of passive ("You can clone a template" not "Clone Template copies..."). Convert the filter table to prose: "Filter by source (all or only mine), by whether the template has an identifier, or by archived status."

- [ ] **Step 6: Rewrite `templates/reference.mdx`**

Convert field tables to workbench "Wizard inputs" style. Replace:
```
| Field | Type | Description |
| ID | number | Unique numeric identifier |
| Name | string | Display name (max 255 chars) |
...
```
With prose field descriptions:
```
ID — Unique numeric identifier
Name — Display name (max 255 chars)
Identifier — Optional unique friendly name (max 255 chars)
Description — Optional summary (max 255 chars)
Owner — Creator's email
Created at — ISO 8601 timestamp
Updated at — ISO 8601 timestamp
Archived — Whether hidden from default view
Cloned from — Source template ID, if cloned
Variables — Name/value pairs (JSON-serializable)
Template files — Files rendered into the script
Workflow files — Scripts for interactive variable gathering
```

Drop the "File Classes" table (redundant with concepts). Keep the "Template Variable" explanation.

- [ ] **Step 7: Verify build**

Run: `just build`. Expected: SUCCESS, no errors.

- [ ] **Step 8: Spell check**

Run: `yarn spellcheck`. Expected: no unknown words.

---

### Task 4: Submissions sub-section — index, submitting, monitoring, lifecycle, reference

**Files:**
- Modify: `docs/platform/jobs/submissions/index.mdx`
- Modify: `docs/platform/jobs/submissions/submitting.mdx`
- Modify: `docs/platform/jobs/submissions/monitoring.mdx`
- Modify: `docs/platform/jobs/submissions/lifecycle.mdx`
- Modify: `docs/platform/jobs/submissions/reference.mdx`

- [ ] **Step 1: Read all five files**

Read: all five submissions files.

- [ ] **Step 2: Rewrite `submissions/index.mdx`**

Open with outcome: "Submissions are your jobs in flight. When you submit a script, it becomes a submission — linked to a cluster, a partition, and a running (or queued) Slurm job."

Drop the status progression diagram (redundant with lifecycle.mdx). Keep lifecycle actions as a simple list. Expand next-step descriptions.

- [ ] **Step 3: Rewrite `submissions/submitting.mdx`**

Already the most workbench-aligned page. Changes:
- Open dialog fields section with: "The submit dialog walks you through four fields; only the submission name and script are required."
- Expand the Hourly Price mention: "The price updates as you change cluster and partition selections."
- Add `:::tip` about partition selection: "Pick a partition with available capacity — the status column shows queue depth."

- [ ] **Step 4: Rewrite `submissions/monitoring.mdx`**

Open with: "The submission detail page tells you everything about a running job: where it is in the pipeline, what resources it's using, and what Slurm thinks of it."

Keep the five tab descriptions. Keep the metrics list (already user-friendly from earlier cleanup). Drop the progress stage code block (already prose from earlier cleanup).

- [ ] **Step 5: Rewrite `submissions/lifecycle.mdx`**

Follow `training-jobs/lifecycle.mdx` format. Simplify:
- **Statuses table** — keep but shorter prose descriptions
- **Actions per status** — keep the matrix (genuinely useful)
- Drop the progress stages section (folded into descriptions)
- Drop the Slurm job states list (redundant with cluster docs)

Add `:::warning` about queue wait times and cost: "Jobs in SUBMITTED status are queued. If the cluster is busy, your job may wait — check cluster utilization before submitting."

- [ ] **Step 6: Polish `submissions/reference.mdx`**

Already cleaned up (no internal field names). Minor polish:
- Add a `Sample rates` mention: "10 seconds, 1 minute, 10 minutes, 1 hour — adjust in the Job Metrics tab."
- Field descriptions already user-facing from previous pass.

- [ ] **Step 7: Verify build**

Run: `just build`. Expected: SUCCESS, no errors.

- [ ] **Step 8: Spell check**

Run: `yarn spellcheck`. Expected: no unknown words.

---

### Task 5: Catalog + final verification

**Files:**
- Modify: `docs/platform/jobs/catalog/index.mdx`

- [ ] **Step 1: Read `catalog/index.mdx`**

- [ ] **Step 2: Polish `catalog/index.mdx`**

Punchier opener: "The Script Catalog is a library of pre-built job scripts that work out of the box on Vantage clusters." Add a sentence about when to use it: "Good for getting started fast with common HPC workloads without writing Slurm from scratch."

That's it — 12 lines, minimal changes needed.

- [ ] **Step 3: Full build verification**

Run: `just build`. Expected: SUCCESS, no errors, no broken links.

- [ ] **Step 4: Full spell check**

Run: `yarn spellcheck`. Expected: no unknown words across the entire project.

---

## Execution

Plan complete and saved to `docs/superpowers/plans/2026-05-08-jobs-voice-rewrite.md`.

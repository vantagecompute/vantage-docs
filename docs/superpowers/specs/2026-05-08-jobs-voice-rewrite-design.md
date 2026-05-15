# Jobs Section Voice Rewrite

## Goal

Rewrite the 18 pages in `docs/platform/jobs/` to match the Workbench section's voice, tone, and readability — outcome-first, conversational, cost-aware, approachable for non-HPC-experienced readers. Page structure stays the same; only content and language change.

## Design (Approved)

### Top-level pages

**`jobs/index.md`** — Follow `workbench/index.mdx` rhythm. Open with: "Vantage Jobs is where you define, submit, and track computational work on your clusters." Bullet the four sub-sections with 1-sentence outcome descriptions. Drop "three primitives" language.

**`jobs/concepts.mdx`** — Reframe from 6 technical sections to 4 broader mental models:
1. The pipeline (Template -> Script -> Submission — prose only, no code-block diagram)
2. Script files (entrypoint vs support — 1-2 sentences + simple table)
3. Archive vs Delete (conversational: "Archive hides it, delete wipes it")
4. Statuses (prose descriptions, no raw enum names)
Add cost mention.

**`jobs/get-started.mdx`** — Keep numbered steps and example script. Open: "Five minutes, one job." Explain partition briefly in step 4. Replace CREATED/SUBMITTED/DONE with "queued" / "running" / "done" in step 5. Add tip/warning.

### Scripts sub-section

**`scripts/index.mdx`** — Open with outcome: "Scripts are where you define what runs on the cluster." Drop lifecycle table (redundant with concepts/managing). 1-2 sentences on what you can do.

**`scripts/creating.mdx`** — Follow `sessions/creating-a-session.mdx` format. Walk through the Create Script dialog conversationally. Describe editor in plain language. Drop the "Script files table" table.

**`scripts/managing.mdx`** — Follow `sessions/lifecycle.mdx` format. Rewrite action table describing what each action does for you. Add tip about archive vs delete.

**`scripts/reference.mdx`** — Follow `training-jobs/reference.mdx` format. Convert field tables to "Wizard inputs" style. Drop Limits table (inline constraints).

### Templates sub-section

**`templates/index.mdx`** — Open with outcome: "Templates let you define a job once and reuse it across your team." Move identifier/workflow details to creating/reference pages.

**`templates/creating.mdx`** — Tone shift. Replace "Executed by the Vantage CLI" with less CLI-focused description. Describe file types in prose, not table. Add Jinja2 tip.

**`templates/using.mdx`** — Already close. Convert field list to prose. Add warning about templates not auto-updating rendered scripts.

**`templates/managing.mdx`** — Tone shift only. Use "you can" instead of passive. Convert filter table to prose.

**`templates/reference.mdx`** — Convert field tables to "Wizard inputs" style. Drop File Classes table (redundant with concepts).

### Submissions sub-section

**`submissions/index.mdx`** — Open with outcome: "Submissions are your jobs in flight." Drop status progression diagram (duplicates lifecycle.mdx). Expand next-step descriptions.

**`submissions/submitting.mdx`** — Already closest to style. Add conversational intro to dialog fields. Expand cost/Hourly Price mention. Add tip about partitions.

**`submissions/monitoring.mdx`** — Open conversationally. Keep tab descriptions but in plain language. Progress stages already cleaned up (previous pass).

**`submissions/lifecycle.mdx`** — Follow `training-jobs/lifecycle.mdx` format. Simplify statuses, keep actions matrix (it's useful). Fold progress stages and Slurm states into status descriptions. Add warning about queue waits and cost.

**`submissions/reference.mdx`** — Minor polish. Field table was already cleaned up (previous pass, no owner_email, no internal names). Keep format since it describes what users see on the detail page.

### Catalog

**`catalog/index.mdx`** — Minimal change. Punchier opener. Add sentence about when you'd use it. 12 lines, nearly done already.

## Exclusions

- No structural reorganization (pages stay, sub-sections stay)
- No new pages created
- No example script removed from get-started.mdx
- No sidebar changes

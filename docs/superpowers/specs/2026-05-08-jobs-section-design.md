# Jobs Section — Design Doc

## Overview

Rewrite `docs/platform/jobs/` to follow the workbench section pattern (concise, Vantage-specific, grouped by feature). The current section has generic Slurm/HPC content, empty reference pages, and a cross-cut structure (tutorials/how-to-guides/reference x scripts/templates/submissions). Replace with a flat hierarchy: one sub-directory per resource type, each containing its own overview, how-to, and reference pages.

## Current State

```
docs/platform/jobs/
  index.md                         # Has content, somewhat thin
  tutorials/                       # Generic Slurm/HPC content — to delete
    index.md
    scripts/ (create, submit, update, delete, share, clone, archive)
    submissions/ (create, delete, view-metrics)
    templates/ (create, share, delete)
  how-to-guides/                   # Mostly empty — to delete
    index.md
    scripts/index.md
    submissions/index.md
    templates/index.md
  reference/
    index.md                       # Empty skeleton
    job-scripts.md                 # 0 bytes
    job-submissions.md             # 0 bytes
    job-templates.md               # 0 bytes
```

All reference and how-to-guide pages are empty or skeletons. All tutorial pages contain generic Slurm scripting advice, not Vantage-specific content.

## Target Structure

```
docs/platform/jobs/
  index.md                         # Rewrite — overview of all 4 sub-sections
  concepts.mdx                     # NEW — mental models for jobs
  get-started.mdx                  # NEW — 5-min quickstart
  scripts/
    index.mdx                      # NEW — overview
    creating.mdx                   # NEW — create dialog + built-in editor
    managing.mdx                   # NEW — clone, archive, delete, restore
    reference.mdx                  # NEW — fields, file classes, limits
  templates/
    index.mdx                      # NEW — overview
    creating.mdx                   # NEW — create template dialog + variables + files
    using.mdx                      # NEW — render template to script
    managing.mdx                   # NEW — clone, archive, delete, identifier
    reference.mdx                  # NEW — variable schema, file classes, permissions
  submissions/
    index.mdx                      # NEW — overview
    submitting.mdx                 # NEW — submit dialog + advanced options
    monitoring.mdx                 # NEW — detail page tabs, metrics, logs
    lifecycle.mdx                  # NEW — statuses, actions per status
    reference.mdx                  # NEW — all statuses, fields, env vars, endpoints
  catalog/
    index.mdx                      # NEW — pre-built script marketplace
```

## Per-Page Specification

### 1. `index.md` (Rewrite)

**Purpose**: Landing page that lists the four sub-areas with one-paragraph descriptions.

**Content**:
- Brief intro: Vantage Jobs provides lifecycle management for computational workloads through three primitives — Job Scripts, Job Templates, and Job Submissions — plus a Script Catalog of pre-built workflows.
- **Scripts**: Slurm batch scripts with a built-in editor, versioning, and team sharing. Entrypoint (.py/.sh) + support files.
- **Templates**: Jinja2-based abstractions that generate scripts from parameterized templates. Questions + template files enable team workflows without CLI knowledge.
- **Submissions**: Dispatched scheduler workloads with real-time metrics, logs, and lifecycle actions (cancel, suspend, resume, retry).
- **Catalog**: Pre-built script marketplace. One-click import to your script library.
- Link each paragraph to its sub-section index.

### 2. `concepts.mdx` (New)

**Purpose**: Key mental models unique to the Jobs section.

**Sections**:

- **Scripts are Slurm batch scripts**: `#SBATCH` directives + executable code. Entrypoint file is what Slurm runs. Support files are auxiliary resources.
- **Templates as an abstraction layer**: Jinja2 templates with variables. Users answer a form → template renders → script is created. Enables standardized workflows without touching the CLI.
- **Template Variables**: Name/value pairs with defaults. Substituted into templates at render time. Support any JSON-serializable value.
- **File Classes**:
  - *Entrypoint*: The executable script (.py or .sh for scripts; .py.j2 or .sh.j2 for templates)
  - *Support*: Auxiliary config files, modules, or sub-scripts
  - *Workflow* (templates only): Scripts executed by the Jobbergate CLI to interactively gather variable values
- **Identifiers** (templates): Optional unique friendly names for frequently-used templates.
- **Archive vs Delete**:
  - *Archive*: Hides from default view. Data and references preserved.
  - *Delete*: Permanent. Files removed. References from submissions/scripts removed.
- **Submission statuses**: CREATED (queued for submission) → SUBMITTED (dispatched to Slurm) → DONE / REJECTED / ABORTED (terminal states).
- **Submission progress stages**: CREATE_JOB → JOB_TO_CLUSTER → SUBMITTING_TO_SLURM → JOB_IN_SLURM → FINALIZE_JOB.

### 3. `get-started.mdx` (New)

**Purpose**: From zero to a completed job in ~5 minutes.

**Steps**:
1. Navigate to **Jobs > Scripts** and click **Create Script**
2. Give it a name, optionally upload a file (or use the blank entrypoint)
3. Write a simple Slurm script using the built-in editor (shebang + `#SBATCH` directives + echo command)
4. From the script's action menu, click **Submit Script**
5. Fill in the submission form (name, script pre-filled, select cluster + partition)
6. Click **Submit** — you're redirected to the Submissions list
7. Watch the status progress: CREATED → SUBMITTED → RUNNING → DONE
8. Click the submission to view logs and metrics

### 4. `scripts/index.mdx` (New)

**Purpose**: Overview of the Job Scripts feature.

**Content**:
- Scripts are the core unit of computational work — Slurm batch files stored in Vantage's script library.
- Each script has a name, description, owner, and one or more files.
- One file is the **entrypoint** (.py or .sh) — what Slurm executes.
- Additional **support files** provide configuration, modules, or sub-scripts.
- Scripts can be created from scratch, cloned from existing scripts, or rendered from templates.
- Lifecycle: active → archived (hidden, references preserved) or deleted (permanent).
- Link to creating, managing, and reference pages.

### 5. `scripts/creating.mdx` (New)

**Content**:
- **Create Script dialog**: Name (required, max 255 chars, unique within org), Description (optional, max 255 chars), File upload (optional, max 5 MB per file, drag-and-drop or browse).
  - If no entrypoint file is uploaded, a blank entrypoint is auto-created (named from the script name).
  - Entrypoint must be `.py` or `.sh`.
- **After creation**: Redirected to script detail page.
- **Built-in editor**: Syntax highlighting, minimap, line numbers. Open by clicking the edit icon on the entrypoint file row. Save with <kbd>Ctrl+S</kbd> or the Save button. Unsaved changes prompt on navigation.
- **Add support files**: Click "+ Add Support File", provide name, upload file.
- **Script files table**: Columns — Name (clickable to edit), Type (Entrypoint File / Support File), Actions (Download, Edit, Delete).

### 6. `scripts/managing.mdx` (New)

**Content**:
- Actions available from the script list row's `···` menu or the detail page's **Actions** button:
  - **Submit Script**: Opens the Submit dialog (see submissions/submitting.mdx)
  - **Clone Script**: Creates a copy with new name + description
  - **Archive Script**: Hides from default view. References from submissions preserved. Show archived scripts via the "Show archived" filter.
  - **Restore Script**: Returns from archived to active state.
  - **Delete Script**: Permanent. All files removed. References from submissions removed.
- **Bulk operations**: Select multiple scripts to archive/restore or delete in batch.
- **Edit**: Name, description, and files can be edited from the detail page.
- **Filters**: Source (View all / Only mine), Archived (Hide / Show).

### 7. `scripts/reference.mdx` (New)

**Content** (tables):

- **Script fields**: id, name, description, owner_email, created_at, updated_at, is_archived, cloned_from_id, parent_template_id, template (parent template data), files (array of TemplateFile objects).
- **File fields**: filename, file_type (ENTRYPOINT | SUPPORT), parent_id, created_at, updated_at.
- **Limits**: Name max 255 chars, Description max 255 chars, File upload max 5 MB, Entrypoint must be .py or .sh.
- **API endpoints**: `GET/POST /jobbergate/job-scripts`, `GET/PUT/DELETE /jobbergate/job-scripts/{id}`, `PUT /jobbergate/job-scripts/{id}/upload/{fileClass}`, `POST /jobbergate/job-scripts/clone/{id}`.

### 8. `templates/index.mdx` (New)

**Purpose**: Overview of Job Script Templates.

**Content**:
- Templates are Jinja2-based abstractions that generate standardized job scripts.
- A template consists of: template variables (name/value pairs with defaults), template files (entrypoint .j2 + support .j2 + optional workflow scripts), and metadata (name, identifier, description).
- **Render** a template to produce a concrete script — the user provides values for each variable, selects the entrypoint file, and Vantage generates a script with all files rendered.
- **Identifier**: An optional unique friendly name for quick access.
- Templates enable team workflows: define parameters and template files once, let team members create scripts without touching the CLI.
- Link to creating, using, managing, and reference pages.

### 9. `templates/creating.mdx` (New)

**Content**:
- **Create Template dialog**: Name (required, max 255), Identifier (optional, unique within org, max 255, validated live for uniqueness), Description (optional, max 255).
- **Template Variables**: Name/value pairs. Add variables with the "Add Variable" button. Each has a Name (the key used in Jinja2 templates) and a Value (the default). Supports any JSON-serializable value. Variables are substituted when the template is rendered to a script.
- **File types**:
  - *Entrypoint Template* (.py.j2 or .sh.j2): Rendered into the script entrypoint. Uses Jinja2 syntax like `{{ variable_name }}`.
  - *Support Template*: Rendered into a support file. Any filename/extension.
  - *Workflow Script*: Special script executed by the Jobbergate CLI to interactively gather variable values (advanced use).
- If no entrypoint file is uploaded, a blank `entrypoint.py.j2` is auto-created.
- After creation, redirected to template detail page.

### 10. `templates/using.mdx` (New)

**Content**:
- **Render Template to Script**: Accessible from the template list row's action menu or detail page.
- Opens a dialog with fields:
  - **Name**: For the new script (required)
  - **Description**: For the new script (optional)
  - **Parameter values**: One input per template variable, pre-filled with defaults
  - **Entrypoint file selection**: Radio group listing all entrypoint-class template files
- Click **Render** → Vantage processes the Jinja2 templates with the provided parameters → creates a new Job Script → navigates to the new script's detail page.
- The generated script preserves a link to its parent template (shown in the script's detail page as "Parent Template").
- Re-render: Changes to the template do NOT affect already-rendered scripts. Render again to produce an updated copy.

### 11. `templates/managing.mdx` (New)

**Content**:
- Actions: Clone, Archive/Restore, Delete (same pattern as scripts).
- **Identifier**: Can be added, changed, or removed on existing templates (edit from detail page). Used for quick access and discoverability.
- **Template Variables**: Can be edited after creation (add, remove, change defaults).
- **Files**: Can be added, updated, or deleted from the detail page's files table.
- **Cloning**: Copies all template data including variables and files.
- **Filters**: Source (View all / Only mine), With identifier (View All / With identifier), Archived (Hide / Show).

### 12. `templates/reference.mdx` (New)

**Content** (tables):

- **Template fields**: id, name, identifier, description, owner_email, created_at, updated_at, is_archived, cloned_from_id, template_vars (Record<string, any>), template_files (array), workflow_files (array).
- **Template variable**: name (string key), value (any JSON-serializable).
- **File classes**: ENTRYPOINT (rendered as .py/.sh), SUPPORT (rendered as-is), WORKFLOW (CLI execution for interactive variable gathering).
- **API endpoints**: `GET/POST /jobbergate/job-script-templates`, `GET/PUT/DELETE /jobbergate/job-script-templates/{id}`, `POST /jobbergate/job-scripts/render-from-template/{id}`, `POST /jobbergate/job-script-templates/clone/{id}`.

### 13. `submissions/index.mdx` (New)

**Purpose**: Overview of Job Submissions.

**Content**:
- Submissions represent workloads dispatched to a Slurm cluster via the Vantage platform.
- Each submission links a Job Script with a target cluster and partition.
- Real-time monitoring: status tracking, resource metrics (CPU, memory, GPU, disk I/O), log viewing, and Slurm job info.
- Status progression: CREATED → SUBMITTED → DONE (or REJECTED / ABORTED on failure).
- Lifecycle actions: Re-submit (for finished jobs), Edit (name/description), Delete.
- Link to submitting, monitoring, lifecycle, and reference pages.

### 14. `submissions/submitting.mdx` (New)

**Content**:
- **Submit dialog** (accessible from script action menu, script detail page, or Submissions page):
  - **Submission Name** (required, pre-filled from script name)
  - **Job Script** (pre-filled if submitting from a script, or searchable select)
  - **Cluster** (required, searchable dropdown of available clusters)
  - **Partition** (required, populates automatically after cluster selection, multi-select, one default pre-selected)
  - **Hourly Price** (shown dynamically based on selected cluster + node types)
  - **Description** (optional textarea)
- **Advanced Options** (collapsible section):
  - **Sbatch Arguments**: Free-text field for adding `--flag=value` arguments. The partition selection auto-generates a `--partition` argument. Additional arguments supplement or override `#SBATCH` directives in the script.
- Submit dispatches the job → redirected to the Submissions list.

### 15. `submissions/monitoring.mdx` (New)

**Content**:
- Submission detail page has 5 tabs:

  **Overview**: Shows key details — Job Submission ID (copyable), Owner (clickable user preview), Script (clickable preview), Cluster (clickable preview), Created timestamp, Last Updated, Slurm Job ID, Slurm Job State, Description. Actions: Re-Submit, Delete, Edit.

  **Job Metrics** (disabled until data is available, ~5 data points needed):
  - Charts: CPU utilization, CPU frequency, Memory RSS, Memory Virtual, GPU utilization, GPU memory, Disk read/write, Page faults
  - Controls: Live data toggle (Since start / Last 3 hours / 30 min / 5 min), Date range picker, Sample rate (10 seconds / 1 minute / 10 minutes / 1 hour), Node selector
  - Data updates in real-time for active jobs

  **Progress**: Table of stage transitions with timestamps. Stages: CREATE_JOB → JOB_TO_CLUSTER → SUBMITTING_TO_SLURM → JOB_IN_SLURM → FINALIZE_JOB. Each stage has a status (LOADING / SUCCESS / ERROR) and timestamp.

  **Sbatch Arguments**: Table showing all sbatch arguments passed at submission time (including the auto-generated `--partition` flag).

  **Slurm Job Info** (available after submission reaches Slurm): Searchable JSON tree viewer showing the raw `scontrol show job` output.

### 16. `submissions/lifecycle.mdx` (New)

**Content**:

- **Vantage Statuses** (application-level):

| Status | Meaning | Color |
|--------|---------|-------|
| CREATED | Script queued for submission to cluster | Gray |
| SUBMITTED | Script dispatched to Slurm | Blue |
| DONE | Cluster finished executing the script | Green |
| REJECTED | Slurm rejected the script (syntax/param error) | Orange |
| ABORTED | Job failed during processing | Pink |

- **Actions per status**:
  - **Re-Submit**: Only available for terminal states (DONE, REJECTED, ABORTED). Creates a new submission from the same script.
  - **Edit**: Name and description can be edited at any time.
  - **Delete**: Available for all states except SUBMITTED (can't delete while running on cluster).

- **Slurm Job States**: 26 standard Slurm states (PENDING, RUNNING, COMPLETED, FAILED, CANCELLED, TIMEOUT, OUT_OF_MEMORY, etc.) are passed through and displayed as `slurm_job_state`.

- **Progress pipeline**: CREATE_JOB → JOB_TO_CLUSTER → SUBMITTING_TO_SLURM → JOB_IN_SLURM (maps to Slurm states) → FINALIZE_JOB.

### 17. `submissions/reference.mdx` (New)

**Content** (tables):

- **Submission fields**: id, name, description, owner_email, client_id, job_script_id, job_script (partial script data), status, slurm_job_id, slurm_job_state, slurm_job_info, sbatch_arguments (string[]), report_message, created_at, updated_at, is_archived.
- **Vantage statuses**: CREATED, SUBMITTED, DONE, REJECTED, ABORTED.
- **Slurm states**: All 26 standard Slurm states.
- **Progress stages**: CREATE_JOB, JOB_TO_CLUSTER, SUBMITTING_TO_SLURM, JOB_IN_SLURM, FINALIZE_JOB.
- **Metrics fields**: cpu_utilization, cpu_frequency, cpu_time, memory_rss, memory_virtual, gpu_utilization, gpu_memory, disk_read, disk_write, page_faults, node_host, step, task, time.
- **Sample rates**: 10 seconds, 1 minute, 10 minutes, 1 hour.
- **API endpoints**: `GET/POST /jobbergate/job-submissions`, `GET/PUT/DELETE /jobbergate/job-submissions/{id}`, `GET /jobbergate/job-submissions/{id}/metrics`, `GET /jobbergate/job-submissions/{id}/progress`, `POST /jobbergate/job-submissions/clone/{id}`.

### 18. `catalog/index.mdx` (New)

**Content**:
- The Script Catalog is a marketplace of pre-built job scripts that work out of the box on Vantage cloud clusters.
- Grid view with search. Each entry shows an icon, name, description (markdown), and an **Import Script** button.
- Import creates a new script in your script library with the entrypoint + all support files.
- Catalog scripts assume a shared `/nfs` folder available on all cluster nodes (may need modification for other setups).

## Implementation Order

1. Delete old files: `tutorials/`, `how-to-guides/`, empty `reference/` files.
2. Create new directory structure.
3. Write in this order (each builds on concepts introduced earlier):
   - `concepts.mdx` — foundational
   - `get-started.mdx` — simplest path
   - `index.md` rewrite — nav hub
   - `scripts/` section (4 pages)
   - `templates/` section (5 pages)
   - `submissions/` section (5 pages)
   - `catalog/` section (1 page)
4. Update sidebar configuration if needed.
5. Review against getting-started pages to avoid duplication.

## Design Decisions

- **Workbench-style grouping**: Each resource type (scripts, templates, submissions) gets its own sub-directory with bundled pages — mirrors the workbench pattern users are familiar with.
- **No concepts overlap**: Jobs concepts are distinct from workbench concepts (no workspace/compute-profile repetition). If a user needs those, link to workbench/concepts.mdx.
- **Reference as tables**: Reference pages are structured data (fields, enums, endpoints) in table format — skimmable, not prose.
- **Getting-started bridges**: The jobs `get-started.mdx` covers the create-script → submit → monitor flow. The existing `get-started/create-job-script-intro.md` and `create-job-submission-intro.md` in the getting-started section remain as first-time walkthroughs for absolute beginners.
- **Catalog is a bonus**: Small section but distinct from the three main primitives. Worth including.

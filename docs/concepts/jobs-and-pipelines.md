---
title: Jobs and pipelines
description: Finite computational work and the DAGs that orchestrate it.
---

# Jobs and pipelines

Jobs are finite computational workloads — single-shot or distributed. Pipelines are multi-step DAGs that string jobs (and other steps) together for ingestion, training, evaluation, and deployment.

## Scripts and submissions

A job starts as a **script** — a `.sh` or `.py` file with `#SBATCH` directives (for Slurm) or a container image with an entrypoint (for Kubernetes). You write the script once, then **submit** it to a cluster. The submission tracks the job through its lifecycle: queued, running, succeeded or failed.

Vantage stores scripts in a script library with version history. You can create them from scratch, import from a file, or render from a template.

## Templates

Templates are Jinja2-based blueprints with parameterized variables. Write a template once with placeholders for dataset paths, cluster config, or resource requirements. When you render it, Vantage fills in the values and produces a concrete script.

Use templates when your team needs standardized job definitions — you control the structure, they fill in the parameters.

## Pipelines

A pipeline is a directed acyclic graph (DAG) of steps. Each step runs a container image with inputs from previous steps. Pipelines handle branching, retries, and artifact passing between steps automatically.

Unlike a single job that runs a self-contained workload, a pipeline coordinates multiple stages. Use pipelines for workflows that combine ingestion, preprocessing, training, evaluation, and deployment in sequence.

## Where to go next

Jobs, scripts, templates, and submissions have their own full section under [Platform > Jobs](/platform/jobs). Pipelines are covered under [Platform > Workbench > Pipelines](/platform/workbench/pipelines). This page is just the high-level picture.

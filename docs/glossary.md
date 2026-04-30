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

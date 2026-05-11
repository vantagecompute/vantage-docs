---
title: Storage
description: Attach persistent volumes, NFS shares, and CephFS mounts to your Kubernetes clusters.
---

# Storage

Storage is where you create and manage the persistent volumes, NFS shares, and CephFS mounts that your Kubernetes workloads and Workbench sessions can read from and write to.

[Get started](/platform/storage/get-started) · [Concepts](/platform/storage/concepts)

## What you'll find inside

- **PVCs** — Persistent Volume Claims backed by your cluster's storage classes. Request the capacity and access mode you need; the cluster provisions the volume automatically.
- **NFS** — Mount an external NFS server or expose an existing PVC as an NFS share accessible across namespaces.
- **CephFS** — Attach a CephFS filesystem from an internal PVC, an external Ceph cluster, or a system-managed storage class.

## Next steps

- [Quickstart](/platform/storage/get-started) — Create your first PVC in under a minute
- [Concepts](/platform/storage/concepts) — Storage types, namespaces, and access modes explained
- [How-to guides](/platform/storage/how-to-guides) — Step-by-step guides for PVCs, NFS, and CephFS

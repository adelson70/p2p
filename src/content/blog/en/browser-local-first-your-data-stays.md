---
title: "Browser local-first: your data stays on your device"
description: "Private Tools stores preferences and history in your browser—not on a product database tied to your identity."
pubDate: 2026-02-10
locale: en
tags: ["privacy", "local-first"]
draft: false
---

“Local-first” means the authoritative copy of your data lives where you work: on your laptop or phone. Cloud sync is optional elsewhere; here, the browser is the primary vault.

## IndexedDB and on-device storage

Settings, transfer history metadata, and tool state can sit in IndexedDB. That storage is scoped to the origin and not shared across random sites.

## No central profile

Without accounts, there is no row in a remote users table describing your files. You are not the product; your activity is not stitched into a marketing graph on our side.

## Clearing data is in your hands

Browser settings let you wipe site data. Because we do not mirror your payload in the cloud, deletion on device actually removes local traces you control.

## Pairing with P2P tools

Local-first pairs naturally with [PrivateDrop](/transfer): content moves peer-to-peer while only small preferences stay on disk locally.

## FAQ

### Do you sync my history to the cloud?

No account-backed sync is required for core tools. Check each tool’s behavior in settings.

### Is IndexedDB secure against other websites?

Other origins cannot read it. Malware or physical access to your unlocked device are separate threats.

### Related reading

[No accounts, no tracking](/blog/no-accounts-no-tracking) and [GDPR/LGPD without collecting data](/blog/gdpr-lgpd-without-collecting-data).

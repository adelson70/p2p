---
title: "What cloud file sharing collects about you"
description: "Upload links look simple, but providers often keep files, logs, and metadata long after the download ends."
pubDate: 2026-01-22
locale: en
tags: ["privacy", "cloud", "metadata"]
draft: false
---

A polished upload page hides a busy backend. When you send a ZIP through a cloud link service, you are not only moving bytes—you are creating records on someone else's infrastructure.

## Content retention

Many services keep files for days or until someone clicks delete. Backups and replication can extend that window. Even encrypted storage still means a third party holds a copy you did not intend to archive.

## Metadata is valuable

IP addresses, browser fingerprints, upload time, download counts, and recipient emails are often logged for abuse prevention and analytics. That metadata can be more durable than the file itself.

## Third parties in the chain

CDNs, anti-virus scanners, and e-mail gateways may see URLs or temporary objects. Each integration expands who can observe your transfer.

## Why browser P2P is different

[PrivateDrop](/transfer) aims to move file bytes peer-to-peer after manual pairing. We do not operate a file warehouse for your payload. You still protect signaling text like a password.

## FAQ

### Can cloud services read my files?

If they hold the keys or scan uploads, yes. Read their terms and encryption claims carefully.

### Is a password on the link enough?

It helps with casual access, not with provider retention or lawful requests.

### Where can I learn more about direct transfer?

See [why P2P protects privacy](/blog/why-peer-to-peer-protects-privacy) and [metadata minimization](/blog/metadata-minimization-file-transfers).

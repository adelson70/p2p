---
title: "Metadata minimization for file transfers"
description: "File names, timing, and pairing logs can leak context even when bytes are encrypted."
pubDate: 2026-04-05
locale: en
tags: ["privacy", "metadata"]
draft: false
---

Encryption protects content; metadata often tells the story anyway. Thoughtful product design reduces what is collected and retained.

## File names and sizes

Names may reveal projects or patient IDs. Consider zipping with neutral archive names before [PrivateDrop](/transfer) when context is sensitive.

## Signaling text

Manual pairing means you control where invite strings travel—do not post them in public Slack channels.

## Server logs

A privacy-first operator avoids logging signaling bodies or file names. Ask vendors what their CDN and app logs retain.

## History on device

Local history in the browser is under your control; clear it on shared machines via settings.

## FAQ

### Does P2P hide file size?

Observers may infer volume from traffic patterns.

### Cloud comparison

[What cloud sharing collects](/blog/what-cloud-file-sharing-collects).

### Regulation angle

[GDPR/LGPD without collecting](/blog/gdpr-lgpd-without-collecting-data).

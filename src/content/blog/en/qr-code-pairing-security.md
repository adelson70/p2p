---
title: "QR code pairing security"
description: "QR codes make WebRTC pairing fast. Treat the encoded signaling data like a temporary key."
pubDate: 2026-03-05
locale: en
tags: ["privacy", "security", "pairing"]
draft: false
---

Private Tools uses QR codes to move signaling text between devices. The QR is a camera-friendly clipboard—not a cloud link to your files.

## What is inside the QR

Session descriptions and ICE candidates: the instructions browsers need to find each other. Anyone who scans an active QR before you connect could join or disrupt the session.

## Best practices

Show QR only to the intended person, avoid projecting it in public calls, and regenerate if you suspect leakage.

## QR is not file hosting

Scanning does not upload your document to a server. Actual bytes flow later over WebRTC once both sides approve the connection in [PrivateDrop](/transfer) or chat tools.

## Relation to passwords

Length and randomness of signaling payloads matter. Treat shared codes like single-use join secrets.

## FAQ

### Can someone brute-force my QR?

Practical attacks focus on intercepting displayed signaling, not guessing entropy-rich payloads.

### Is screenshotting safe?

Screenshots of active signaling are sensitive. Delete them after pairing.

### Corporate networks

If pairing fails, see [corporate networks and P2P](/blog/corporate-networks-and-p2p).

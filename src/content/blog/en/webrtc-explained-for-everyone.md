---
title: "WebRTC explained for everyone"
description: "WebRTC is the browser technology behind direct chat, calls, and file transfer—without uploading your payload to our servers."
pubDate: 2026-02-01
locale: en
tags: ["privacy", "webrtc"]
draft: false
---

WebRTC is a set of browser APIs that lets two devices talk directly when the network allows it. Private Tools uses it for [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat), and related tools.

## Signaling is not your file

Before peers connect, they exchange session descriptions and network candidates—small text blobs often shared via QR or copy/paste. That step is signaling. Your actual files or messages travel later on encrypted channels.

## STUN helps you find each other

Most home networks sit behind NAT. A STUN server only helps each side learn a reachable address; it does not receive your file bytes.

## When TURN might appear

If direct UDP is blocked, a future optional TURN relay could forward encrypted packets. Even then, a privacy-first design keeps payloads end-to-end inside WebRTC and avoids cloud file storage.

## Why this matters for privacy

Understanding signaling vs media/data channels clarifies what you must protect (pairing text) and what never touches a file warehouse.

## FAQ

### Is WebRTC the same as a VPN?

No. WebRTC connects two browsers for a session; VPNs route all traffic through a tunnel.

### Can websites snoop on WebRTC content?

Same-origin policy and encryption protect the channel from random pages. Malware on your device is a separate risk.

### Where to try it?

Open [PrivateDrop](/transfer) and pair two browsers on the same Wi‑Fi to see signaling in action.

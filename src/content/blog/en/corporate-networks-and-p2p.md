---
title: "Corporate networks and P2P"
description: "Firewalls and proxies sometimes block direct WebRTC. Here is what you can try without giving up on privacy."
pubDate: 2026-03-28
locale: en
tags: ["privacy", "webrtc", "networks"]
draft: false
---

Enterprise networks prioritize control. UDP, peer discovery, and unknown destinations are often restricted—exactly what casual P2P needs.

## Symptoms

Pairing succeeds but data channel stalls, or ICE stays disconnected. Refresh signaling after a few seconds as our tools suggest.

## Try another network

Mobile hotspot tests whether policy—not the product—is the blocker.

## VPN considerations

A consumer VPN may help or hurt depending on whether it allows UDP between peers. It does not replace reading your employer's acceptable use policy.

## Future TURN options

An optional relay could improve connectivity while still avoiding cloud **file** storage. Signaling-only infrastructure is a different privacy trade than WeTransfer-style uploads.

## FAQ

### Does IT see file names?

On P2P, payloads are encrypted on the wire; policy tools may still see volume and endpoints.

### QR pairing on guest Wi‑Fi

Often works better than locked-down VLANs. See [QR security](/blog/qr-code-pairing-security).

### Basics

[WebRTC explained](/blog/webrtc-explained-for-everyone).

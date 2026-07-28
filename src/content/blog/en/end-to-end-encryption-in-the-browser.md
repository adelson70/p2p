---
title: "End-to-end encryption in the browser"
description: "Modern browsers can encrypt chat and call media between peers. Here is what that means—and what it does not promise."
pubDate: 2026-02-25
locale: en
tags: ["privacy", "encryption"]
draft: false
---

End-to-end encryption (E2E) means only conversation participants can read the content. intermediaries should see ciphertext at most.

## WebRTC security basics

WebRTC uses DTLS for data channels and SRTP for audio/video. Keys are negotiated per session between peers, not handed to a file storage API.

## Chat vs file transfer

[PrivateChat](/communication/privatechat) messages ride the data channel. [PrivateDrop](/transfer) streams chunks the same way. Neither path uploads your payload to a Private Tools file server.

## Honest limits

E2E does not stop someone from screenshotting a chat, forwarding signaling text, or compromising an unlocked device. It also does not hide that you used WebRTC from a strict network observer.

## Compare with cloud inbox products

Server-held encryption still lets the provider rotate keys or comply with lawful access. Peer sessions shrink that surface for content itself.

## FAQ

### Do you hold decryption keys?

We do not operate a cloud inbox for your files or messages in these tools.

### Is QR pairing E2E?

QR carries signaling, not file contents. Protect it like a one-time password.

### Threat model details

Read [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect).

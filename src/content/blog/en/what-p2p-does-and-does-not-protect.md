---
title: "What P2P does and does not protect"
description: "Peer-to-peer transfer removes cloud file storage from the story—but not every risk."
pubDate: 2026-03-12
locale: en
tags: ["privacy", "threat-model"]
draft: false
---

Privacy tools work best when you know their boundaries. Browser P2P is strong against third-party file warehousing; weaker against local compromise and network policy.

## Protects: cloud copies of payloads

[PrivateDrop](/transfer) is designed so file chunks move between peers, not into a Private Tools bucket.

## Protects: vendor data breaches of file content

If we never store your payload, we cannot leak it from a file database we do not run.

## Does not protect: malicious peers

If you send to the wrong person, encryption cannot undo the mistake.

## Does not protect: compromised devices

Keyloggers, remote access trojans, or unlocked shared PCs bypass transport security.

## Does not fully protect: network observers

ISPs or corporate firewalls may still see connection metadata or block UDP. Read [corporate networks](/blog/corporate-networks-and-p2p).

## FAQ

### Is P2P anonymous to my ISP?

They may see encrypted WebRTC flows between IP addresses.

### Malware scanning?

No cloud AV step runs on your bytes in this model—that is a trade-off you choose.

### Cloud sharing comparison

[What cloud file sharing collects](/blog/what-cloud-file-sharing-collects).

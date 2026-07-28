---
title: "二维码配对的安全性"
description: "二维码加快 WebRTC 配对。请将信令数据视为临时密钥。"
pubDate: 2026-03-05
locale: zh
tags: ["privacy", "security", "pairing"]
draft: false
---

二维码用于在设备间传递信令，不是指向您文件的云链接。

## 二维码内容

会话描述与 ICE 候选。连接前被他人扫描可能导致会话被干扰。

## 最佳实践

仅向接收方展示，避免在公开场合投屏，怀疑泄露时重新生成。

## 文件字节随后经 WebRTC 传输

见 [PrivateDrop](/transfer)。

## FAQ

### 企业网络

[企业网络与 P2P](/blog/corporate-networks-and-p2p)。

---
title: "浏览器中的端到端加密"
description: "现代浏览器可在对等方之间加密聊天与媒体。含义与局限如下。"
pubDate: 2026-02-25
locale: zh
tags: ["privacy", "encryption"]
draft: false
---

端到端（E2E）指仅会话参与方可读内容。

## WebRTC

数据通道用 DTLS，音视频用 SRTP；密钥在两端按会话协商。

## 聊天与文件

[PrivateChat](/communication/privatechat) 与 [PrivateDrop](/transfer) 均不上传内容到我们的文件服务器。

## 局限

无法阻止截图、信令泄露或已入侵设备。

## FAQ

### 你们持有解密密钥吗？

这些工具不设云端收件箱。

### 威胁模型

见[ P2P 的保护范围](/blog/what-p2p-does-and-does-not-protect)。

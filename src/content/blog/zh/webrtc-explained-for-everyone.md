---
title: "一文读懂 WebRTC"
description: "WebRTC 是浏览器实现直连聊天、通话与文件传输的技术，无需把文件内容上传到我们的服务器。"
pubDate: 2026-02-01
locale: zh
tags: ["privacy", "webrtc"]
draft: false
---

WebRTC 是一组浏览器 API，在网络允许时让两台设备直接通信。Private Tools 在 [PrivateDrop](/transfer)、[PrivateChat](/communication/privatechat) 等工具中使用它。

## 信令不是文件

连接前双方交换会话描述与网络候选——通常通过二维码或复制粘贴分享的小段文本。文件与消息随后走加密通道。

## STUN 帮助发现地址

家庭网络多在 NAT 后。STUN 仅帮助获知可达地址，不接收文件字节。

## 何时可能需要 TURN

若直连 UDP 被阻，未来可选的 TURN 中继可能转发加密包，仍避免云文件存储。

## 与隐私的关系

区分信令与数据通道，就清楚应保护配对文本而非担心“文件仓库”。

## FAQ

### WebRTC 是 VPN 吗？

不是。WebRTC 连接两个浏览器；VPN 隧道化全部流量。

### 在哪里试用？

打开 [PrivateDrop](/transfer)，在同一 Wi‑Fi 下配对两个浏览器。

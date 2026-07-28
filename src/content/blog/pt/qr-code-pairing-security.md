---
title: "Segurança do pareamento por QR code"
description: "QR codes aceleram o pareamento WebRTC. Trate o texto de sinalização como chave temporária."
pubDate: 2026-03-05
locale: pt
tags: ["privacy", "security", "pairing"]
draft: false
---

O Private Tools usa QR para mover sinalização entre dispositivos. O QR é uma área de transferência para a câmera — não um link na nuvem para seus arquivos.

## O que há no QR

Descrições de sessão e candidatos ICE. Quem escanear um QR ativo antes da conexão pode tentar entrar ou atrapalhar.

## Boas práticas

Mostre só para quem deve receber, evite projetar em calls públicas e regenere se suspeitar de vazamento.

## QR não hospeda arquivo

Escanear não envia documento a servidor. Bytes fluem depois no WebRTC no [PrivateDrop](/transfer).

## Como senha

Trate códigos compartilhados como segredos de uso único.

## FAQ

### Alguém pode adivinhar meu QR?

Ataques reais focam em interceptar sinalização exibida.

### Redes corporativas

Veja [redes corporativas e P2P](/blog/corporate-networks-and-p2p).

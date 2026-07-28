---
title: "Criptografia ponta a ponta no navegador"
description: "Navegadores modernos criptografam chat e mídia entre pares. Veja o que isso significa — e o que não promete."
pubDate: 2026-02-25
locale: pt
tags: ["privacy", "encryption"]
draft: false
---

Criptografia ponta a ponta (E2E) significa que só os participantes leem o conteúdo; intermediários veem no máximo ciphertext.

## Básico do WebRTC

WebRTC usa DTLS em canais de dados e SRTP em áudio/vídeo. Chaves são negociadas por sessão entre pares.

## Chat vs arquivo

[PrivateChat](/communication/privatechat) e [PrivateDrop](/transfer) usam o canal de dados sem backend de arquivos no Private Tools.

## Limites honestos

E2E não impede print, vazamento de sinalização ou dispositivo comprometido. Também não esconde o uso de WebRTC de um observador de rede rigoroso.

## Comparado a caixa de entrada na nuvem

Criptografia no servidor ainda permite rotação de chaves pelo provedor. Sessões entre pares reduzem essa superfície para o conteúdo.

## FAQ

### Vocês guardam chaves?

Não operamos caixa de entrada na nuvem para esses payloads.

### QR é E2E?

QR carrega sinalização, não arquivos. Proteja como senha descartável.

### Modelo de ameaça

[O que P2P protege](/blog/what-p2p-does-and-does-not-protect).

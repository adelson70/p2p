---
title: "WebRTC explicado para qualquer pessoa"
description: "WebRTC é a tecnologia do navegador por trás de chat, chamadas e transferência direta — sem enviar o payload aos nossos servidores."
pubDate: 2026-02-01
locale: pt
tags: ["privacy", "webrtc"]
draft: false
---

WebRTC é um conjunto de APIs que permite dois dispositivos conversarem diretamente quando a rede permite. O Private Tools usa isso no [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat) e ferramentas relacionadas.

## Sinalização não é o seu arquivo

Antes da conexão, os pares trocam descrições de sessão e candidatos de rede — textos curtos via QR ou copiar/colar. Isso é sinalização. Arquivos e mensagens vão depois em canais criptografados.

## STUN ajuda a se encontrar

Redes domésticas usam NAT. Um servidor STUN só ajuda cada lado a descobrir um endereço alcançável; não recebe bytes do arquivo.

## Quando TURN pode aparecer

Se UDP direto for bloqueado, um relay TURN opcional no futuro poderia encaminhar pacotes criptografados. Mesmo assim, o desenho prioriza privacidade e evita armazenamento de arquivos na nuvem.

## Por que isso importa para privacidade

Separar sinalização de dados deixa claro o que proteger (texto de pareamento) e o que não passa por armazém.

## FAQ

### WebRTC é VPN?

Não. WebRTC liga dois navegadores por sessão; VPN tunela todo o tráfego.

### Sites podem espionar o WebRTC?

Política de mesma origem e criptografia protegem o canal. Malware no dispositivo é outro risco.

### Onde testar?

Abra o [PrivateDrop](/transfer) e pareie dois navegadores na mesma rede.

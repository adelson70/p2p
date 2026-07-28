---
title: "Por que compartilhar ponto a ponto protege sua privacidade"
description: "Serviços na nuvem copiam seus arquivos para computadores de terceiros. Transferência P2P no navegador mantém o conteúdo só entre você e quem recebe."
pubDate: 2026-01-15
locale: pt
tags: ["privacy", "p2p", "transfer"]
draft: false
---

Em um site tradicional de envio de arquivos, o documento costuma sair do seu notebook duas vezes: no upload e de novo quando a outra pessoa baixa. É prático, mas cria uma cópia permanente em infraestrutura que você não controla.

Na transferência ponto a ponto (P2P) no navegador, o fluxo muda. Depois de um pareamento curto, os bytes trafegam direto entre os navegadores por um canal WebRTC criptografado. O Private Tools não armazena seus arquivos em servidor de aplicação.

## Uploads geram cópias extras

Mesmo com promessa de criptografia, o provedor guarda ciphertext em disco, registra acessos e pode ser obrigado a reter dados. Você também confia em equipes internas, backups e futuros compradores da empresa.

Com o [PrivateDrop](/transfer), a carga sensível fica no caminho entre os pares. O site só ajuda a trocar metadados de conexão no pareamento — não o conteúdo dos arquivos.

## Você decide quem recebe

Quando a sessão termina, não resta um link público em CDN, a menos que você compartilhe de propósito o texto de sinalização. Isso reduz vazamentos acidentais em e-mails ou grupos de chat.

## Menos atores no modelo de ameaça

Cada servidor a mais é um ponto onde metadados ou conteúdo podem vazar. O P2P tira o “armazém de arquivos” do desenho. Você ainda precisa confiar na outra pessoa e na segurança do seu dispositivo, mas elimina uma classe inteira de risco de nuvem.

## Quando o P2P é o padrão certo

Para rascunhos confidenciais, exames de imagem, pastas jurídicas ou mídia grande que não deve passar por storage de terceiros, a transferência direta costuma ser a opção mais privada e ainda simples para quem não é técnico.

## FAQ

### O Private Tools vê meus arquivos?

Não. Os pedaços do arquivo fluem por WebRTC entre os pares. Não há backend de arquivos no [PrivateDrop](/transfer).

### P2P funciona sempre?

Algumas redes corporativas bloqueiam UDP direto. Trocar novamente os dados de sinalização pode ajudar; veja o artigo sobre [redes corporativas](/blog/corporate-networks-and-p2p).

### Como isso se compara ao WeTransfer?

Leia [alternativas com foco em privacidade](/blog/privacy-first-alternatives-to-wetransfer) e o guia [enviar arquivos grandes](/send-large-files).

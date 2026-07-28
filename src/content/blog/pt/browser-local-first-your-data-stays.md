---
title: "Local-first no navegador: seus dados ficam no dispositivo"
description: "O Private Tools guarda preferências e histórico no navegador — não em banco de produto ligado à sua identidade."
pubDate: 2026-02-10
locale: pt
tags: ["privacy", "local-first"]
draft: false
---

“Local-first” significa que a cópia principal dos dados fica onde você trabalha: no notebook ou celular. Aqui, o navegador é o cofre principal.

## IndexedDB e armazenamento local

Configurações, metadados de histórico e estado das ferramentas podem ficar no IndexedDB, isolado por origem.

## Sem perfil central

Sem contas, não há linha remota de “usuário” descrevendo seus arquivos. Sua atividade não vira gráfico de marketing do nosso lado.

## Apagar dados está nas suas mãos

As opções do navegador permitem limpar dados do site. Como não espelhamos payload na nuvem, apagar localmente remove rastros que você controla.

## Combina com P2P

Local-first combina com [PrivateDrop](/transfer): conteúdo vai entre pares; só preferências pequenas ficam no disco.

## FAQ

### Vocês sincronizam histórico na nuvem?

Ferramentas principais não exigem sync com conta. Veja ajustes.

### Outros sites leem o IndexedDB?

Não, por isolamento de origem. Malware ou acesso físico são outros riscos.

### Leitura relacionada

[Sem contas, sem rastreamento](/blog/no-accounts-no-tracking) e [GDPR/LGPD sem coletar dados](/blog/gdpr-lgpd-without-collecting-data).

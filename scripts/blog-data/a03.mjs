export default {
  slug: 'webrtc-explained-for-everyone',
  pubDate: '2026-02-01',
  tags: ['privacy', 'webrtc'],
  locales: {
    en: {
      title: 'WebRTC explained for everyone',
      description:
        'WebRTC is the browser technology behind direct chat, calls, and file transfer—without uploading your payload to our servers.',
      body: `WebRTC is a set of browser APIs that lets two devices talk directly when the network allows it. Private Tools uses it for [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat), and related tools.

## Signaling is not your file

Before peers connect, they exchange session descriptions and network candidates—small text blobs often shared via QR or copy/paste. That step is signaling. Your actual files or messages travel later on encrypted channels.

## STUN helps you find each other

Most home networks sit behind NAT. A STUN server only helps each side learn a reachable address; it does not receive your file bytes.

## When TURN might appear

If direct UDP is blocked, a future optional TURN relay could forward encrypted packets. Even then, a privacy-first design keeps payloads end-to-end inside WebRTC and avoids cloud file storage.

## Why this matters for privacy

Understanding signaling vs media/data channels clarifies what you must protect (pairing text) and what never touches a file warehouse.

## FAQ

### Is WebRTC the same as a VPN?

No. WebRTC connects two browsers for a session; VPNs route all traffic through a tunnel.

### Can websites snoop on WebRTC content?

Same-origin policy and encryption protect the channel from random pages. Malware on your device is a separate risk.

### Where to try it?

Open [PrivateDrop](/transfer) and pair two browsers on the same Wi‑Fi to see signaling in action.`,
    },
    pt: {
      title: 'WebRTC explicado para qualquer pessoa',
      description:
        'WebRTC é a tecnologia do navegador por trás de chat, chamadas e transferência direta — sem enviar o payload aos nossos servidores.',
      body: `WebRTC é um conjunto de APIs que permite dois dispositivos conversarem diretamente quando a rede permite. O Private Tools usa isso no [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat) e ferramentas relacionadas.

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

Abra o [PrivateDrop](/transfer) e pareie dois navegadores na mesma rede.`,
    },
    es: {
      title: 'WebRTC explicado para todos',
      description:
        'WebRTC es la tecnología del navegador detrás del chat, las llamadas y la transferencia directa sin subir el payload a nuestros servidores.',
      body: `WebRTC son APIs del navegador que permiten hablar directamente entre dos dispositivos cuando la red lo permite. Private Tools lo usa en [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat) y herramientas afines.

## La señalización no es tu archivo

Antes de conectar, se intercambian descripciones de sesión y candidatos de red — textos breves por QR o copiar/pegar. Eso es señalización. Archivos y mensajes van después por canales cifrados.

## STUN ayuda a encontrarse

Las redes domésticas usan NAT. STUN solo ayuda a descubrir una dirección alcanzable; no recibe bytes del archivo.

## Cuándo podría aparecer TURN

Si UDP directo está bloqueado, un relay TURN opcional podría reenviar paquetes cifrados sin almacenamiento de archivos en la nube.

## Por qué importa a la privacidad

Distinguir señalización de datos aclara qué proteger (texto de emparejamiento) y qué no pasa por almacén.

## FAQ

### ¿WebRTC es una VPN?

No. WebRTC une dos navegadores por sesión; la VPN tunela todo.

### ¿Pueden espiar el contenido?

Origen y cifrado protegen el canal. El malware local es otro riesgo.

### ¿Dónde probarlo?

Abre [PrivateDrop](/transfer) y empareja dos navegadores en la misma red.`,
    },
    fr: {
      title: 'WebRTC expliqué simplement',
      description:
        'WebRTC est la technologie du navigateur derrière chat, appels et transfert direct — sans envoyer votre payload sur nos serveurs.',
      body: `WebRTC regroupe des API qui permettent à deux appareils de communiquer directement quand le réseau le permet. Private Tools l’utilise pour [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat) et outils associés.

## La signalisation n’est pas votre fichier

Avant la connexion, les pairs échangent descriptions de session et candidats réseau — petits textes via QR ou copier-coller. Les fichiers et messages suivent sur des canaux chiffrés.

## STUN aide à se trouver

Derrière la NAT, un serveur STUN indique une adresse joignable ; il ne reçoit pas les octets du fichier.

## Quand TURN pourrait intervenir

Si l’UDP direct est bloqué, un relais TURN optionnel pourrait faire suivre des paquets chiffrés sans stockage cloud des fichiers.

## Intérêt pour la confidentialité

Distinguer signalisation et données clarifie ce qu’il faut protéger (texte d’appariement).

## FAQ

### WebRTC est-il un VPN ?

Non. WebRTC relie deux navigateurs pour une session.

### Où essayer ?

Ouvrez [PrivateDrop](/transfer) et appariez deux navigateurs sur le même réseau.`,
    },
    zh: {
      title: '一文读懂 WebRTC',
      description:
        'WebRTC 是浏览器实现直连聊天、通话与文件传输的技术，无需把文件内容上传到我们的服务器。',
      body: `WebRTC 是一组浏览器 API，在网络允许时让两台设备直接通信。Private Tools 在 [PrivateDrop](/transfer)、[PrivateChat](/communication/privatechat) 等工具中使用它。

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

打开 [PrivateDrop](/transfer)，在同一 Wi‑Fi 下配对两个浏览器。`,
    },
  },
};

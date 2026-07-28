export default {
  slug: 'end-to-end-encryption-in-the-browser',
  pubDate: '2026-02-25',
  tags: ['privacy', 'encryption'],
  locales: {
    en: {
      title: 'End-to-end encryption in the browser',
      description:
        'Modern browsers can encrypt chat and call media between peers. Here is what that means—and what it does not promise.',
      body: `End-to-end encryption (E2E) means only conversation participants can read the content. intermediaries should see ciphertext at most.

## WebRTC security basics

WebRTC uses DTLS for data channels and SRTP for audio/video. Keys are negotiated per session between peers, not handed to a file storage API.

## Chat vs file transfer

[PrivateChat](/communication/privatechat) messages ride the data channel. [PrivateDrop](/transfer) streams chunks the same way. Neither path uploads your payload to a Private Tools file server.

## Honest limits

E2E does not stop someone from screenshotting a chat, forwarding signaling text, or compromising an unlocked device. It also does not hide that you used WebRTC from a strict network observer.

## Compare with cloud inbox products

Server-held encryption still lets the provider rotate keys or comply with lawful access. Peer sessions shrink that surface for content itself.

## FAQ

### Do you hold decryption keys?

We do not operate a cloud inbox for your files or messages in these tools.

### Is QR pairing E2E?

QR carries signaling, not file contents. Protect it like a one-time password.

### Threat model details

Read [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect).`,
    },
    pt: {
      title: 'Criptografia ponta a ponta no navegador',
      description:
        'Navegadores modernos criptografam chat e mídia entre pares. Veja o que isso significa — e o que não promete.',
      body: `Criptografia ponta a ponta (E2E) significa que só os participantes leem o conteúdo; intermediários veem no máximo ciphertext.

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

[O que P2P protege](/blog/what-p2p-does-and-does-not-protect).`,
    },
    es: {
      title: 'Cifrado de extremo a extremo en el navegador',
      description:
        'Los navegadores modernos cifran chat y medios entre pares. Qué significa y qué no promete.',
      body: `E2E implica que solo los participantes leen el contenido.

## WebRTC

DTLS en datos y SRTP en audio/video; claves por sesión entre pares.

## Chat y archivos

[PrivateChat](/communication/privatechat) y [PrivateDrop](/transfer) sin servidor de archivos nuestro.

## Límites

No evita capturas, filtración de señalización ni malware local.

## FAQ

### ¿Guardáis claves?

No hay buzón cloud para estos payloads.

### Modelo de amenaza

[Qué protege el P2P](/blog/what-p2p-does-and-does-not-protect).`,
    },
    fr: {
      title: 'Chiffrement de bout en bout dans le navigateur',
      description:
        'Les navigateurs modernes chiffrent chat et médias entre pairs. Ce que cela signifie — et ce que cela n’assure pas.',
      body: `Le E2E signifie que seuls les participants lisent le contenu.

## WebRTC

DTLS pour les données, SRTP pour l’audio/vidéo ; clés négociées par session.

## Chat et fichiers

[PrivateChat](/communication/privatechat) et [PrivateDrop](/transfer) sans serveur de fichiers Private Tools.

## Limites

Pas de protection contre captures ou appareil compromis.

## FAQ

### Clés chez nous ?

Pas de boîte cloud pour ces contenus.

### Modèle de menace

[Ce que le P2P protège](/blog/what-p2p-does-and-does-not-protect).`,
    },
    zh: {
      title: '浏览器中的端到端加密',
      description: '现代浏览器可在对等方之间加密聊天与媒体。含义与局限如下。',
      body: `端到端（E2E）指仅会话参与方可读内容。

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

见[ P2P 的保护范围](/blog/what-p2p-does-and-does-not-protect)。`,
    },
  },
};

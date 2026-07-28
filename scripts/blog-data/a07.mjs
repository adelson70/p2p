export default {
  slug: 'qr-code-pairing-security',
  pubDate: '2026-03-05',
  tags: ['privacy', 'security', 'pairing'],
  locales: {
    en: {
      title: 'QR code pairing security',
      description:
        'QR codes make WebRTC pairing fast. Treat the encoded signaling data like a temporary key.',
      body: `Private Tools uses QR codes to move signaling text between devices. The QR is a camera-friendly clipboard—not a cloud link to your files.

## What is inside the QR

Session descriptions and ICE candidates: the instructions browsers need to find each other. Anyone who scans an active QR before you connect could join or disrupt the session.

## Best practices

Show QR only to the intended person, avoid projecting it in public calls, and regenerate if you suspect leakage.

## QR is not file hosting

Scanning does not upload your document to a server. Actual bytes flow later over WebRTC once both sides approve the connection in [PrivateDrop](/transfer) or chat tools.

## Relation to passwords

Length and randomness of signaling payloads matter. Treat shared codes like single-use join secrets.

## FAQ

### Can someone brute-force my QR?

Practical attacks focus on intercepting displayed signaling, not guessing entropy-rich payloads.

### Is screenshotting safe?

Screenshots of active signaling are sensitive. Delete them after pairing.

### Corporate networks

If pairing fails, see [corporate networks and P2P](/blog/corporate-networks-and-p2p).`,
    },
    pt: {
      title: 'Segurança do pareamento por QR code',
      description:
        'QR codes aceleram o pareamento WebRTC. Trate o texto de sinalização como chave temporária.',
      body: `O Private Tools usa QR para mover sinalização entre dispositivos. O QR é uma área de transferência para a câmera — não um link na nuvem para seus arquivos.

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

Veja [redes corporativas e P2P](/blog/corporate-networks-and-p2p).`,
    },
    es: {
      title: 'Seguridad del emparejamiento con código QR',
      description:
        'Los QR aceleran el emparejamiento WebRTC. Trata la señalización como clave temporal.',
      body: `Los QR mueven texto de señalización entre dispositivos, no son enlaces cloud a tus archivos.

## Contenido del QR

Descripciones de sesión e ICE. Quien escanee un QR activo antes de conectar puede interferir.

## Buenas prácticas

Muéstralo solo al destinatario y regenera si hay duda.

## Los bytes van después por WebRTC

En [PrivateDrop](/transfer) tras conectar.

## FAQ

### Redes corporativas

[Redes corporativas y P2P](/blog/corporate-networks-and-p2p).`,
    },
    fr: {
      title: 'Sécurité de l’appariement par QR code',
      description:
        'Les QR accélèrent l’appariement WebRTC. Traitez la signalisation comme une clé temporaire.',
      body: `Le QR transporte de la signalisation, pas un lien cloud vers vos fichiers.

## Contenu

Descriptions de session et candidats ICE ; interception possible si affiché publiquement.

## Bonnes pratiques

Montrer uniquement au destinataire ; régénérer en cas de doute.

## Données ensuite via WebRTC

Dans [PrivateDrop](/transfer).

## FAQ

### Réseaux d’entreprise

[Réseaux d’entreprise et P2P](/blog/corporate-networks-and-p2p).`,
    },
    zh: {
      title: '二维码配对的安全性',
      description: '二维码加快 WebRTC 配对。请将信令数据视为临时密钥。',
      body: `二维码用于在设备间传递信令，不是指向您文件的云链接。

## 二维码内容

会话描述与 ICE 候选。连接前被他人扫描可能导致会话被干扰。

## 最佳实践

仅向接收方展示，避免在公开场合投屏，怀疑泄露时重新生成。

## 文件字节随后经 WebRTC 传输

见 [PrivateDrop](/transfer)。

## FAQ

### 企业网络

[企业网络与 P2P](/blog/corporate-networks-and-p2p)。`,
    },
  },
};

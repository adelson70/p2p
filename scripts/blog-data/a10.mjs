export default {
  slug: 'corporate-networks-and-p2p',
  pubDate: '2026-03-28',
  tags: ['privacy', 'webrtc', 'networks'],
  locales: {
    en: {
      title: 'Corporate networks and P2P',
      description:
        'Firewalls and proxies sometimes block direct WebRTC. Here is what you can try without giving up on privacy.',
      body: `Enterprise networks prioritize control. UDP, peer discovery, and unknown destinations are often restricted—exactly what casual P2P needs.

## Symptoms

Pairing succeeds but data channel stalls, or ICE stays disconnected. Refresh signaling after a few seconds as our tools suggest.

## Try another network

Mobile hotspot tests whether policy—not the product—is the blocker.

## VPN considerations

A consumer VPN may help or hurt depending on whether it allows UDP between peers. It does not replace reading your employer's acceptable use policy.

## Future TURN options

An optional relay could improve connectivity while still avoiding cloud **file** storage. Signaling-only infrastructure is a different privacy trade than WeTransfer-style uploads.

## FAQ

### Does IT see file names?

On P2P, payloads are encrypted on the wire; policy tools may still see volume and endpoints.

### QR pairing on guest Wi‑Fi

Often works better than locked-down VLANs. See [QR security](/blog/qr-code-pairing-security).

### Basics

[WebRTC explained](/blog/webrtc-explained-for-everyone).`,
    },
    pt: {
      title: 'Redes corporativas e P2P',
      description:
        'Firewalls às vezes bloqueiam WebRTC direto. O que tentar sem abrir mão da privacidade.',
      body: `Redes empresariais restringem UDP e destinos desconhecidos.

## Sintomas

Pareamento ok, canal de dados parado. Atualize sinalização.

## Teste outra rede

Hotspot do celular isola política vs produto.

## VPN

Pode ajudar ou atrapalhar UDP. Respeite política da empresa.

## TURN futuro

Relay opcional melhora conectividade sem armazém de **arquivos** na nuvem.

## FAQ

[QR](/blog/qr-code-pairing-security) e [WebRTC](/blog/webrtc-explained-for-everyone).`,
    },
    es: {
      title: 'Redes corporativas y P2P',
      description: 'Los firewalls a veces bloquean WebRTC directo.',
      body: `Síntomas: ICE desconectado. Refresca señalización o prueba otra red.

## TURN futuro

Mejor conectividad sin almacén de archivos.

## FAQ

[QR](/blog/qr-code-pairing-security).`,
    },
    fr: {
      title: 'Réseaux d’entreprise et P2P',
      description: 'Les pare-feu bloquent parfois le WebRTC direct.',
      body: `Rafraîchir la signalisation ou tester un autre réseau.

## TURN futur

Relais sans stockage de fichiers cloud.

## FAQ

[QR](/blog/qr-code-pairing-security).`,
    },
    zh: {
      title: '企业网络与 P2P',
      description: '防火墙有时阻止直连 WebRTC。',
      body: `可刷新信令或换网络（如手机热点）测试。

## 未来 TURN

改善连通性且不设云文件库。

## FAQ

[二维码安全](/blog/qr-code-pairing-security)。`,
    },
  },
};

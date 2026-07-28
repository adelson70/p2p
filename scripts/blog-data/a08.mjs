export default {
  slug: 'what-p2p-does-and-does-not-protect',
  pubDate: '2026-03-12',
  tags: ['privacy', 'threat-model'],
  locales: {
    en: {
      title: 'What P2P does and does not protect',
      description: 'Peer-to-peer transfer removes cloud file storage from the story—but not every risk.',
      body: `Privacy tools work best when you know their boundaries. Browser P2P is strong against third-party file warehousing; weaker against local compromise and network policy.

## Protects: cloud copies of payloads

[PrivateDrop](/transfer) is designed so file chunks move between peers, not into a Private Tools bucket.

## Protects: vendor data breaches of file content

If we never store your payload, we cannot leak it from a file database we do not run.

## Does not protect: malicious peers

If you send to the wrong person, encryption cannot undo the mistake.

## Does not protect: compromised devices

Keyloggers, remote access trojans, or unlocked shared PCs bypass transport security.

## Does not fully protect: network observers

ISPs or corporate firewalls may still see connection metadata or block UDP. Read [corporate networks](/blog/corporate-networks-and-p2p).

## FAQ

### Is P2P anonymous to my ISP?

They may see encrypted WebRTC flows between IP addresses.

### Malware scanning?

No cloud AV step runs on your bytes in this model—that is a trade-off you choose.

### Cloud sharing comparison

[What cloud file sharing collects](/blog/what-cloud-file-sharing-collects).`,
    },
    pt: {
      title: 'O que o P2P protege — e o que não protege',
      description:
        'Transferência P2P tira o armazém na nuvem do caminho, mas não elimina todo risco.',
      body: `Ferramentas de privacidade funcionam melhor quando você conhece os limites.

## Protege: cópias na nuvem do payload

[PrivateDrop](/transfer) move pedaços entre pares.

## Protege: vazamento de conteúdo em breach do provedor

Sem payload nosso, não há vazamento de arquivo em banco inexistente.

## Não protege: par malicioso ou erro de destinatário

## Não protege: dispositivo comprometido

## Não protege totalmente: observadores de rede

Veja [redes corporativas](/blog/corporate-networks-and-p2p).

## FAQ

### ISP vê algo?

Pode ver fluxos WebRTC criptografados entre IPs.

### Comparar com nuvem

[O que a nuvem coleta](/blog/what-cloud-file-sharing-collects).`,
    },
    es: {
      title: 'Qué protege el P2P y qué no',
      description: 'El P2P quita el almacén cloud, pero no todos los riesgos.',
      body: `## Protege copias cloud del payload

[PrivateDrop](/transfer) entre pares.

## No protege destinatario equivocado ni malware local

## Redes

[Redes corporativas](/blog/corporate-networks-and-p2p).

## FAQ

[Qué recopila la nube](/blog/what-cloud-file-sharing-collects).`,
    },
    fr: {
      title: 'Ce que le P2P protège — et ce qu’il ne protège pas',
      description: 'Le P2P retire l’entrepôt cloud, pas tous les risques.',
      body: `## Protège les copies cloud du payload

[PrivateDrop](/transfer) entre pairs.

## Ne protège pas erreur de destinataire ni appareil compromis

## Réseau

[Réseaux d’entreprise](/blog/corporate-networks-and-p2p).

## FAQ

[Ce que le cloud collecte](/blog/what-cloud-file-sharing-collects).`,
    },
    zh: {
      title: 'P2P 能保护什么、不能保护什么',
      description: '点对点传输去掉云文件存储，但并非万能。',
      body: `## 保护：避免第三方保存文件副本

[PrivateDrop](/transfer) 在两端间传输。

## 不保护：发错人、本地恶意软件

## 网络观察者

[企业网络](/blog/corporate-networks-and-p2p)。

## FAQ

[云分享收集什么](/blog/what-cloud-file-sharing-collects)。`,
    },
  },
};

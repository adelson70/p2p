export default {
  slug: 'metadata-minimization-file-transfers',
  pubDate: '2026-04-05',
  tags: ['privacy', 'metadata'],
  locales: {
    en: {
      title: 'Metadata minimization for file transfers',
      description:
        'File names, timing, and pairing logs can leak context even when bytes are encrypted.',
      body: `Encryption protects content; metadata often tells the story anyway. Thoughtful product design reduces what is collected and retained.

## File names and sizes

Names may reveal projects or patient IDs. Consider zipping with neutral archive names before [PrivateDrop](/transfer) when context is sensitive.

## Signaling text

Manual pairing means you control where invite strings travel—do not post them in public Slack channels.

## Server logs

A privacy-first operator avoids logging signaling bodies or file names. Ask vendors what their CDN and app logs retain.

## History on device

Local history in the browser is under your control; clear it on shared machines via settings.

## FAQ

### Does P2P hide file size?

Observers may infer volume from traffic patterns.

### Cloud comparison

[What cloud sharing collects](/blog/what-cloud-file-sharing-collects).

### Regulation angle

[GDPR/LGPD without collecting](/blog/gdpr-lgpd-without-collecting-data).`,
    },
    pt: {
      title: 'Minimização de metadados em transferências',
      description:
        'Nomes, horários e logs de pareamento vazam contexto mesmo com bytes criptografados.',
      body: `Criptografia protege conteúdo; metadados contam a história.

## Nomes de arquivo

Podem revelar projetos ou IDs. Use ZIP com nome neutro no [PrivateDrop](/transfer) quando necessário.

## Texto de sinalização

Não publique convites em canais públicos.

## Logs

Operadores focados em privacidade evitam logar sinalização ou nomes.

## Histórico local

Limpe em máquinas compartilhadas.

## FAQ

[Nuvem](/blog/what-cloud-file-sharing-collects) e [GDPR/LGPD](/blog/gdpr-lgpd-without-collecting-data).`,
    },
    es: {
      title: 'Minimizar metadatos al transferir archivos',
      description: 'Nombres y horarios filtran contexto aunque el contenido esté cifrado.',
      body: `Usa nombres neutros en ZIP antes de [PrivateDrop](/transfer).

No publiques señalización en canales públicos.

## FAQ

[Qué recopila la nube](/blog/what-cloud-file-sharing-collects).`,
    },
    fr: {
      title: 'Minimiser les métadonnées lors des transferts',
      description: 'Noms et horaires révèlent le contexte malgré le chiffrement.',
      body: `Archives ZIP au nom neutre pour [PrivateDrop](/transfer).

Ne publiez pas la signalisation en public.

## FAQ

[Cloud](/blog/what-cloud-file-sharing-collects).`,
    },
    zh: {
      title: '文件传输中的元数据最小化',
      description: '即使内容加密，文件名与时间仍可能泄露语境。',
      body: `敏感场景可在 [PrivateDrop](/transfer) 前用中性名称打包 ZIP。

勿在公开频道发布信令。

## FAQ

[云收集](/blog/what-cloud-file-sharing-collects)。`,
    },
  },
};

export default {
  slug: 'gdpr-lgpd-without-collecting-data',
  pubDate: '2026-03-20',
  tags: ['privacy', 'gdpr', 'lgpd'],
  locales: {
    en: {
      title: 'GDPR and LGPD when you are not collecting personal data',
      description:
        'Regulations still matter for privacy-first products—even when you skip accounts and file hosting.',
      body: `GDPR (Europe) and LGPD (Brazil) focus on lawful, transparent processing of personal data. A browser tool that avoids accounts and cloud payloads can minimize what it processes—but minimization is not exemption from good practices.

## Data minimization by design

If you do not run a user table or file warehouse, many classic DPIA risks shrink: no massive breach of uploaded documents on your servers.

## What might still be personal

Server logs, support e-mails, or optional analytics could contain IPs or identifiers. Keep those collections narrow and documented.

## User rights still apply

Even with little data, people may ask what you process. Clear privacy copy and contact paths matter.

## Pairing with local-first

[Browser local-first](/blog/browser-local-first-your-data-stays) keeps history on device; [no accounts](/blog/no-accounts-no-tracking) avoids profiling.

## FAQ

### Are signaling payloads personal data?

They can be if they identify individuals in context. Treat signaling carefully and avoid logging it.

### LGPD for Brazilian users?

Same minimization mindset: collect less, explain clearly.

### Metadata article

[Metadata minimization](/blog/metadata-minimization-file-transfers).`,
    },
    pt: {
      title: 'GDPR e LGPD quando você quase não coleta dados pessoais',
      description:
        'Regulações importam mesmo para produtos focados em privacidade — sem contas e sem hospedar arquivos.',
      body: `GDPR e LGPD tratam de tratamento lícito e transparente de dados pessoais. Evitar contas e payload na nuvem reduz o escopo, mas não elimina boas práticas.

## Minimização por desenho

Sem tabela de usuários ou armazém de arquivos, muitos riscos clássicos de vazamento somem.

## O que ainda pode ser pessoal

Logs de servidor, e-mails de suporte ou analytics opcionais podem ter IP. Mantenha coleções estreitas e documentadas.

## Direitos do titular

Mesmo com poucos dados, pessoas podem perguntar o que é processado. Textos claros importam.

## Com local-first

[Local-first](/blog/browser-local-first-your-data-stays) e [sem contas](/blog/no-accounts-no-tracking).

## FAQ

### Sinalização é dado pessoal?

Pode ser em contexto identificável. Evite logar sinalização.

### Metadados

[Minimização de metadados](/blog/metadata-minimization-file-transfers).`,
    },
    es: {
      title: 'GDPR y LGPD sin recopilar datos personales',
      description:
        'Las normas siguen importando aunque evites cuentas y alojamiento de archivos.',
      body: `Minimizar datos reduce riesgos de brechas en servidores de archivos.

## Qué puede seguir siendo personal

Logs, soporte o analítica opcional con IP.

## Derechos de las personas

Transparencia clara aunque haya poco procesamiento.

## Lecturas

[Local-first](/blog/browser-local-first-your-data-stays) y [sin cuentas](/blog/no-accounts-no-tracking).

## FAQ

[Minimizar metadatos](/blog/metadata-minimization-file-transfers).`,
    },
    fr: {
      title: 'RGPD et LGPD sans collecter de données personnelles',
      description:
        'Les règles comptent même sans comptes ni hébergement de fichiers.',
      body: `La minimisation réduit les risques de fuite de documents sur vos serveurs.

## Données encore possibles

Journaux, support, analytique optionnelle.

## Droits des personnes

Transparence même avec peu de traitement.

## Liens

[Local-first](/blog/browser-local-first-your-data-stays) et [pas de comptes](/blog/no-accounts-no-tracking).

## FAQ

[Métadonnées](/blog/metadata-minimization-file-transfers).`,
    },
    zh: {
      title: '几乎不收集个人数据时的 GDPR 与 LGPD',
      description: '即使无账户、不托管文件，合规与透明仍然重要。',
      body: `最小化设计可降低传统文件库泄露风险。

## 仍可能构成个人数据

服务器日志、支持邮件或可选分析中的 IP。

## 用户权利

即使处理很少，也应说明清楚。

## 相关

[本地优先](/blog/browser-local-first-your-data-stays)、[无账户](/blog/no-accounts-no-tracking)。

## FAQ

[元数据最小化](/blog/metadata-minimization-file-transfers)。`,
    },
  },
};

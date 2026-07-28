export default {
  slug: 'browser-local-first-your-data-stays',
  pubDate: '2026-02-10',
  tags: ['privacy', 'local-first'],
  locales: {
    en: {
      title: 'Browser local-first: your data stays on your device',
      description:
        'Private Tools stores preferences and history in your browser—not on a product database tied to your identity.',
      body: `“Local-first” means the authoritative copy of your data lives where you work: on your laptop or phone. Cloud sync is optional elsewhere; here, the browser is the primary vault.

## IndexedDB and on-device storage

Settings, transfer history metadata, and tool state can sit in IndexedDB. That storage is scoped to the origin and not shared across random sites.

## No central profile

Without accounts, there is no row in a remote users table describing your files. You are not the product; your activity is not stitched into a marketing graph on our side.

## Clearing data is in your hands

Browser settings let you wipe site data. Because we do not mirror your payload in the cloud, deletion on device actually removes local traces you control.

## Pairing with P2P tools

Local-first pairs naturally with [PrivateDrop](/transfer): content moves peer-to-peer while only small preferences stay on disk locally.

## FAQ

### Do you sync my history to the cloud?

No account-backed sync is required for core tools. Check each tool’s behavior in settings.

### Is IndexedDB secure against other websites?

Other origins cannot read it. Malware or physical access to your unlocked device are separate threats.

### Related reading

[No accounts, no tracking](/blog/no-accounts-no-tracking) and [GDPR/LGPD without collecting data](/blog/gdpr-lgpd-without-collecting-data).`,
    },
    pt: {
      title: 'Local-first no navegador: seus dados ficam no dispositivo',
      description:
        'O Private Tools guarda preferências e histórico no navegador — não em banco de produto ligado à sua identidade.',
      body: `“Local-first” significa que a cópia principal dos dados fica onde você trabalha: no notebook ou celular. Aqui, o navegador é o cofre principal.

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

[Sem contas, sem rastreamento](/blog/no-accounts-no-tracking) e [GDPR/LGPD sem coletar dados](/blog/gdpr-lgpd-without-collecting-data).`,
    },
    es: {
      title: 'Local-first en el navegador: tus datos se quedan en el dispositivo',
      description:
        'Private Tools guarda preferencias e historial en el navegador, no en una base de producto ligada a tu identidad.',
      body: `“Local-first” significa que la copia principal vive donde trabajas: en tu portátil o móvil. Aquí el navegador es la bóveda principal.

## IndexedDB y almacenamiento local

Ajustes e historial pueden vivir en IndexedDB, aislado por origen.

## Sin perfil central

Sin cuentas no hay fila remota de usuario describiendo tus archivos. Tu actividad no alimenta un gráfico de marketing nuestro.

## Borrar datos depende de ti

El navegador permite limpiar datos del sitio. Sin espejo en la nube, borrar localmente elimina rastros que controlas.

## Encaja con P2P

Local-first encaja con [PrivateDrop](/transfer): contenido entre pares; preferencias mínimas en disco.

## FAQ

### ¿Sincronizáis historial en la nube?

Las herramientas base no requieren sync con cuenta.

### ¿Otros sitios leen IndexedDB?

No, por aislamiento de origen.

### Lecturas relacionadas

[Sin cuentas ni rastreo](/blog/no-accounts-no-tracking) y [GDPR/LGPD sin recopilar](/blog/gdpr-lgpd-without-collecting-data).`,
    },
    fr: {
      title: 'Local-first dans le navigateur : vos données restent sur l’appareil',
      description:
        'Private Tools stocke préférences et historique dans le navigateur, pas dans une base produit liée à votre identité.',
      body: `« Local-first » signifie que la copie principale vit sur votre machine. Ici le navigateur est le coffre principal.

## IndexedDB et stockage local

Réglages et métadonnées d’historique peuvent résider dans IndexedDB, isolé par origine.

## Pas de profil central

Sans compte, pas de ligne utilisateur distante décrivant vos fichiers.

## Effacer les données vous appartient

Le navigateur permet de vider les données du site. Sans miroir cloud du payload, l’effacement local retire les traces que vous contrôlez.

## Avec le P2P

Cela s’accorde avec [PrivateDrop](/transfer) : contenu entre pairs, petites préférences en local.

## FAQ

### Synchronisez-vous l’historique ?

Les outils de base n’exigent pas de sync par compte.

### Lecture liée

[Pas de comptes, pas de suivi](/blog/no-accounts-no-tracking) et [RGPD/LGPD sans collecte](/blog/gdpr-lgpd-without-collecting-data).`,
    },
    zh: {
      title: '浏览器本地优先：数据留在您的设备上',
      description:
        'Private Tools 将偏好与历史保存在浏览器中，而非绑定身份的产品数据库。',
      body: `“本地优先”指权威数据副本留在您工作的设备上。在此，浏览器是主要保险库。

## IndexedDB 与本地存储

设置、历史元数据等可存在按源隔离的 IndexedDB 中。

## 无中央档案

没有账户就没有远程用户表描述您的文件，活动也不会被拼成营销图谱。

## 清除数据由您掌控

浏览器可清除站点数据。我们不在云端镜像文件内容，本地删除即移除您可控的痕迹。

## 与 P2P 工具配合

与 [PrivateDrop](/transfer) 天然契合：内容点对点，仅少量偏好落盘。

## FAQ

### 会把历史上传到云吗？

核心工具不要求账户同步。

### 相关阅读

[无账户、无追踪](/blog/no-accounts-no-tracking)与[不收集数据时的 GDPR/LGPD](/blog/gdpr-lgpd-without-collecting-data)。`,
    },
  },
};

---
title: "WebRTC expliqué simplement"
description: "WebRTC est la technologie du navigateur derrière chat, appels et transfert direct — sans envoyer votre payload sur nos serveurs."
pubDate: 2026-02-01
locale: fr
tags: ["privacy", "webrtc"]
draft: false
---

WebRTC regroupe des API qui permettent à deux appareils de communiquer directement quand le réseau le permet. Private Tools l’utilise pour [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat) et outils associés.

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

Ouvrez [PrivateDrop](/transfer) et appariez deux navigateurs sur le même réseau.

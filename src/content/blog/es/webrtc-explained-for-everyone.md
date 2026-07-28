---
title: "WebRTC explicado para todos"
description: "WebRTC es la tecnología del navegador detrás del chat, las llamadas y la transferencia directa sin subir el payload a nuestros servidores."
pubDate: 2026-02-01
locale: es
tags: ["privacy", "webrtc"]
draft: false
---

WebRTC son APIs del navegador que permiten hablar directamente entre dos dispositivos cuando la red lo permite. Private Tools lo usa en [PrivateDrop](/transfer), [PrivateChat](/communication/privatechat) y herramientas afines.

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

Abre [PrivateDrop](/transfer) y empareja dos navegadores en la misma red.

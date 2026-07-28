# Plano: PrivateWhiteboard (colaboração P2P)

Objetivo: canvas compartilhado entre dois navegadores, **sem servidor de dados**, com o **mesmo pareamento manual** (convite/resposta + QR) já usado em PrivateDrop, PrivateChat e PrivateCall.

---

## 1. Referência de arquitetura (copiar padrão existente)

| Camada | Referência | Whiteboard |
|--------|------------|------------|
| Sinalização SDP/ICE | `signalingManual.ts`, `pairingQr.ts`, `privatedrop/roles.ts` | Reutilizar 100% |
| UI de pareamento | `privatedrop/components.tsx` (`PairingStep`, `ShareSignalingBlock`, `SignalingCodeField`, `ConnectionBadge`) | Mesmos blocos, strings `whiteboard.*` |
| Sessão global | `connectionSession.ts` | `phase`, `roomCode`, erros |
| WebRTC base | `webrtc.ts`, `rtcConfig.ts` | Novo label de canal |
| Connection manager | `chatConnectionManager.ts` | `whiteboardConnectionManager.ts` (espelho do chat) |
| App shell | `HubLayout` + `fillMain` | Tela cheia no canvas |
| Registry / rotas | `registry.ts`, `pages/{en,pt}/collaboration/...` | `status: 'live'`, path `collaboration/whiteboard` |

**Não** misturar canais: uma sessão WebRTC dedicada ao quadro (como chat não reutiliza o canal do PrivateDrop).

---

## 2. WebRTC

### 2.1 Constante

Em `webrtc.ts`:

```ts
export const WHITEBOARD_DATA_CHANNEL = 'privateboard';
```

Função `createWhiteboardDataChannel(pc)` — igual a `createChatDataChannel`, `ordered: true`, `binaryType: arraybuffer`.

### 2.2 `whiteboardConnectionManager.ts`

- Papéis: `host` | `guest` (mesma semântica do chat).
- Host: `createPeerConnection` → `createWhiteboardDataChannel` → `createOffer` → pacote de sinalização.
- Guest: `acceptOffer` → `createAnswer` → pacote resposta.
- ICE buffer + `ICE_GATHER_TIMEOUT_MS`.
- `waitForDataChannel()`, `hangUp()`, `dispose()`, `remote_hangup` via fechar PC ou mensagem de controle opcional (`leave` no protocolo).
- **Sem** mídia (`getUserMedia`); só data channel.

---

## 3. Protocolo de desenho (`protocol.ts`)

Canal **ordenado**; mensagens JSON (texto) para eventos pequenos; opcionalmente chunks binários só se exportar imagem grande no futuro.

### 3.1 Tipos wire (proposta v1)

```ts
type WhiteboardWire =
  | { type: 'stroke'; id: string; color: string; width: number; points: [number, number][] }
  | { type: 'stroke_seg'; id: string; points: [number, number][] }  // continuação (pointer move)
  | { type: 'stroke_end'; id: string }
  | { type: 'clear' }
  | { type: 'undo'; strokeId: string }
  | { type: 'leave' };
```

- Coordenadas **normalizadas** `0..1` em relação ao tamanho lógico do canvas (evita drift entre resoluções).
- `stroke`: primeiro segmento ao `pointerdown`.
- `stroke_seg`: amostragem a cada N ms ou N px no pointermove (throttle local ~16–32 ms).
- `stroke_end`: pointerup / pointerleave.
- `clear`: limpa camada remota + local.
- `undo`: remove último traço do peer (v1: um nível; v2: pilha por autor).

Validação: `parseWhiteboardWire(raw): WhiteboardWire | null` + testes Vitest (como `privatechat/protocol.test.ts`).

### 3.2 Sessão (`WhiteboardSession.ts`)

- Recebe `RTCDataChannel`, callbacks `onRemoteStroke`, `onClear`, `onPeerLeft`.
- `sendStrokeStart`, `sendStrokeSeg`, `sendStrokeEnd`, `clear()`, `leave()`.
- Fila de envio se `bufferedAmount` alto (mesmo padrão de backpressure do file sender, simplificado).

---

## 4. Renderização (`CanvasBoard.tsx`)

- `<canvas>` responsivo: `ResizeObserver` → ajustar `width/height` devicePixelRatio; redesenhar strokes armazenados.
- Estado local: `Stroke[]` com `id`, `color`, `width`, `points[]`.
- Desenho: `lineCap: 'round'`, `lineJoin: 'round'`, quadratic smoothing entre pontos (opcional v1: polyline).
- Pointer events: `pointerdown` / `move` / `up` com `setPointerCapture`.
- Toolbar fixa (estilo app): cor (paleta), espessura, borracha (traço branco ou modo erase v2), limpar, sair.
- **Sem persistência** em IndexedDB na v1 (igual chat em memória); opcional “Exportar PNG” só local.

---

## 5. UI (`WhiteboardApp.tsx`)

Fluxo de passos (igual `PrivateChatApp`):

1. `role` — Criar sala / Entrar na sala  
2. `pairing` — host/guest steps + QR + colar código + detecção invite/answer  
3. `board` — header (sala, DTLS badge, privacidade, sair) + `CanvasBoard` + toolbar  

`fillMain` nas páginas Astro:

- `src/pages/en/collaboration/whiteboard/index.astro`
- `src/pages/pt/collaboration/whiteboard/index.astro`

Atualizar `collaboration/index.astro` para listar ferramenta live (ou `ToolsDirectory` já puxa do registry).

---

## 6. i18n

Bloco `whiteboard` em `en.json` / `pt.json`:

- Títulos, subtítulos, `createRoom`, `joinRoom`, passos de pareamento, `wrongRoleOffer` / `wrongRoleAnswer`
- `connectionStatus`, estados de conexão, `leave`, `peerLeft`, `clearBoard`, `undo`, `exportPng` (se implementar)
- `encryptionBadge` / `encryptionHint` (DTLS no data channel; traços só entre peers)
- Entrada em `tools.whiteboard` (já existe parcialmente)

Remover ou substituir `collaboration.soonMessage` quando o whiteboard estiver live.

---

## 7. Registry e documentação

- `registry.ts`: `whiteboard` → `status: 'live'`, `path: 'collaboration/whiteboard'`.
- `README.md`: seção PrivateWhiteboard (pareamento, protocolo, sem servidor).
- `src/tools/whiteboard/README.md` (opcional, curto).

---

## 8. Testes e CI

- `protocol.test.ts`: round-trip serialize/parse, rejeição de JSON inválido.
- Teste unitário leve de normalização de coordenadas (função pura).
- `npm test`, `npm run check`, `npm run build`.

---

## 9. Ordem de implementação sugerida

1. `WHITEBOARD_DATA_CHANNEL` + `whiteboardConnectionManager` + teste manual com dois abas.  
2. `protocol.ts` + testes.  
3. `WhiteboardSession` (eco de strokes entre abas).  
4. `CanvasBoard` + desenho local.  
5. `WhiteboardApp` + pareamento (copiar estrutura do chat).  
6. Rotas, i18n, registry, collaboration hub.  
7. Polimento: throttle, undo, clear, acessibilidade toolbar.  

---

## 10. Fora do escopo v1 (backlog)

- Mais de 2 participantes (mesh ou SFU — não alinhado ao produto atual).
- CRDT / OT completo (canal ordenado + host clock basta para 2 peers).
- Sincronizar viewport/zoom entre peers.
- Integrar whiteboard dentro do PrivateChat (canal multiplexado — complexidade alta; manter app separada).

---

## 11. Checklist de paridade com PrivateChat

- [ ] Host/guest + `assertSignalingPacketRole`
- [ ] QR opcional + clipboard
- [ ] `ConnectionBadge` durante pareamento
- [ ] Header com room code + DTLS + leave
- [ ] `fillMain` sem footer
- [ ] Hang up limpa PC e volta ao passo `role`
- [ ] STUN via `createRtcConfiguration()`

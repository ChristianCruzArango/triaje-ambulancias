# `realtime/` — difusión en vivo por WebSocket

## Para qué sirve

Empuja cada cambio a los navegadores conectados en cuanto ocurre, para que el
mapa y los paneles se muevan solos.

## Regla de diseño

**El WebSocket transmite cambios, no es la fuente de verdad.** Al reconectar,
el frontend recarga todo por HTTP (`GET /emergencies`). Y nada se emite antes
de estar persistido.

## Los cuatro eventos

| Evento | Cuándo | Qué se ve en pantalla |
|---|---|---|
| `emergency.received` | Entró una llamada | Aparece el incidente **en gris** y se oye el audio |
| `emergency.triaged` | Jev respondió y el protocolo decidió | El incidente **cambia al color de su prioridad** |
| `emergency.dispatched` | Se eligió ambulancia y hospital | Sale la ambulancia, se resalta el hospital |
| `fleet.updated` | La flota se movió | Las ambulancias avanzan |

Llegan **por separado y en ese orden** a propósito. Ese escalonado es lo que
hace visible dónde interviene cada pieza: primero el hecho, después el juicio
de Jev, después la decisión del código.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `realtime.gateway.ts` | Gateway de Socket.IO y métodos de emisión. |
| `constants/realtime-events.constant.ts` | Los nombres de evento. |
| `interfaces/realtime-payloads.interface.ts` | Forma de cada payload. |

Los nombres están duplicados en
`frontend/src/app/core/realtime/constants/realtime-events.constant.ts`.
Si cambia uno, cambia el otro.

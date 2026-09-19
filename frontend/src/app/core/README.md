# `core/` — infraestructura compartida

Todo lo que no es una pieza de pantalla.

| Carpeta | Responsabilidad |
|---|---|
| `api/` | `EmergenciesApiService`: único punto de entrada HTTP hacia NestJS. |
| `maps/` | `GoogleMapsLoader`: carga el script de Maps una vez, todo configurado desde `environments/`. |
| `models/` | `emergency.model.ts`, el contrato con el backend. **Solo tipos.** |
| `realtime/` | `RealtimeService` (Socket.IO), nombres de evento en `constants/`, payloads en `interfaces/`. |
| `state/` | `EmergenciesStore`: el estado de la aplicación en señales. |

## El store

Carga por HTTP y aplica los deltas del socket. Expone señales de solo lectura y
métodos para los controles.

Señales derivadas:
- `selected` — la emergencia seleccionada.
- `activeEmergencies` — las que siguen abiertas.
- `reviewCount` — cuántas quedaron en revisión humana.
- `overruledCount` — **cuántas veces el hospital más cercano no fue el
  elegido**. Es la métrica del valor del sistema.

## El contrato

`models/emergency.model.ts` debe coincidir con
`backend/src/emergencies/interfaces/emergency-dto.interface.ts`. No contiene
constantes ni payloads de socket: esos viven en `realtime/constants/` y
`realtime/interfaces/`.

# Backend — triaje y despacho

NestJS 12 (ESM) + TypeORM + PostgreSQL. Cliente oficial `@typesafe-ai/sdk`.

## Los módulos

Cada uno tiene su propio `README.md` en `src/<módulo>/`.

| Módulo | Qué hace |
|---|---|
| `jev/` | Las 9 preguntas de triaje a System One. |
| `triage/` | El protocolo que calcula la prioridad. |
| `dispatch/` | Elige ambulancia y hospital. |
| `hospitals/` | 12 hospitales de Cali y distancias. |
| `ambulances/` | La flota y su movimiento. |
| `emergencies/` | La llamada y la cadena completa. |
| `simulator/` | Genera llamadas desde direcciones reales. |
| `realtime/` | Difusión por WebSocket. |
| `stats/` | Totales de uso y de despacho. |
| `config/`, `persistence/`, `health/` | Infraestructura. |

## Endpoints

```
GET  /health              GET  /emergencies       POST /emergencies
GET  /hospitals           GET  /emergencies/:id
GET  /ambulances          GET  /stats/ai
POST /ambulances/redeploy GET  /simulator/state
POST /simulator/call      POST /simulator/pause   POST /simulator/resume
```

WebSocket: `emergency.received`, `emergency.triaged`, `emergency.dispatched`,
`fleet.updated`.

## Variables de entorno

Ver `.env.example`. El esquema de `src/config/env.validation.ts` es la **única**
fuente de valores por defecto: no se duplican en el código.

Las claves de TypeSafe viven solo aquí y nunca llegan al navegador.

## Migraciones

En `development` TypeORM sincroniza el esquema. Para producción:

```bash
npm run migration:generate -- src/persistence/migrations/Nombre
npm run migration:run
```

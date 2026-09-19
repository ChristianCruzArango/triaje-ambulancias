# `emergencies/` — la llamada y la cadena completa

## Para qué sirve

Guarda cada llamada y orquesta todo lo que pasa con ella.

## El orden, que no se negocia

```
1. PERSISTIR la llamada y emitirla      ← existe aunque todo lo demás falle
2. JEV clasifica                        ← ~300 ms, ~$0.000045
3. PROTOCOLO calcula la prioridad       ← código, microsegundos
4. DESPACHO elige ambulancia y hospital ← aritmética, microsegundos
```

Los pasos 2–4 corren **en segundo plano**, después de responder. Por eso:

- Si Jev se cae, **la emergencia ya existe** y queda en revisión humana, que es
  exactamente lo que debe pasar.
- La llamada se inserta **una sola vez**: `emergency_id` es único en
  `triage_assessments`, la clave de idempotencia.
- La interfaz ve llegar cada paso por separado, y eso es lo que hace visible
  dónde interviene cada pieza.

## El modelo de datos

| Tabla | Qué guarda |
|---|---|
| `emergencies` | La llamada, la prioridad, la regla aplicada y el despacho. |
| `triage_assessments` | La respuesta de Jev, **con qué se envió, cuánto tardó y cuánto costó**. |

## Por qué se guarda lo que se envió

`sentState` y `sentQuestions` guardan el JSON exacto que viajó a Jev. Sin eso
no se puede mostrar "esto es lo que se le preguntó al modelo" ni auditar una
decisión después. Junto con `latencyMs`, `inputTokens` y `costUsd` dan la
trazabilidad completa.

`nearestOverruled` y `hospitalCandidates` guardan qué hospitales se
descartaron y por qué — la evidencia del aporte de Jev.

## Endpoints

| Ruta | Qué hace |
|---|---|
| `GET /emergencies` | Listado con evaluación y despacho. |
| `GET /emergencies/:id` | Una emergencia. |
| `POST /emergencies` | Alta manual. Es lo que usa el micrófono. |

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `services/emergency-pipeline.service.ts` | La cadena completa. |
| `services/emergency-mapper.service.ts` | Entidad → DTO. |
| `emergencies.service.ts` | Consultas. |
| `emergencies.controller.ts` | Los tres endpoints. |
| `entities/` | Las dos tablas. |
| `interfaces/` | El contrato con Angular y el enum de estado. |
| `constants/` | Orígenes de solicitud. |
| `dto/` | Validación del cuerpo entrante. |

El contrato es espejo de `frontend/src/app/core/models/emergency.model.ts`.

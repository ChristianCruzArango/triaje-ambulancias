# `stats/` — totales de uso de IA

## Para qué sirve

Alimenta el contador de la barra superior: cuántas veces se llamó a Jev y al
LLM, cuánto costó en total y cuánto tardan de media.

Se calcula con agregados SQL sobre `event_assessments` y `event_explanations`,
así que los totales **sobreviven a un reinicio** del backend.

## Endpoint

`GET /stats/ai`

```json
{
  "jev": { "calls": 42, "totalCostUsd": 0.00106, "avgLatencyMs": 380, "totalInputTokens": 25200 },
  "llm": { "calls": 42, "totalCostUsd": 0.0042, "avgLatencyMs": 120, "templateCalls": 31 }
}
```

`templateCalls` es cuántas explicaciones salieron de una plantilla en vez del
modelo — la métrica que muestra cuánto se está ahorrando.

## Cuidado con el redondeo

Los costes de Jev son diminutos (una evaluación ronda los **0,000025 USD**).
La interfaz debe formatearlos con suficientes decimales; redondear a dos deja
todo en `$0.00` y la cifra deja de significar nada.

# `hospitals/` — los 12 hospitales de Cali y las distancias

## Para qué sirve

Guarda el catálogo de hospitales con sus capacidades clínicas, y calcula
distancias. Es lo que permite al despacho elegir.

## Qué es real y qué no

**Reales:** los nombres y las coordenadas. Geocodificados una sola vez con
Nominatim (OpenStreetMap) y congelados en
`constants/cali-hospitals.constant.ts`. En ejecución no se geocodifica nada.

**De demostración:** las capacidades y las camas disponibles. Están asignadas
de forma plausible según el nivel de complejidad conocido de cada institución,
pero **no se verificaron con ninguna fuente oficial**. En un sistema real
vendrían del sistema de cada hospital.

## Las capacidades

`urgencias_generales`, `unidad_acv`, `trauma_mayor`, `hemodinamia`, `quemados`,
`pediatria`, `obstetricia`, `uci_adultos`.

Jev nunca elige un hospital: dice qué capacidad necesita el paciente, y
`findCapableOf()` filtra. Esa indirección es lo que hace el sistema auditable.

## Por qué la distancia vive aquí y no en Jev

`services/geo.service.ts` calcula distancias con la fórmula de haversine.
Es **aritmética**, y jev-1.13 no compara magnitudes de forma fiable
(<https://docs.typesafe.ai/model-jaggedness/jev-1.13#math-and-numbers>).
A Jev nunca se le pregunta "cuál está más cerca".

Los tiempos son una estimación por velocidad media urbana, no una ruta por
calles.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `hospitals.service.ts` | Catálogo, filtro por capacidad y orden por distancia. |
| `hospitals.controller.ts` | `GET /hospitals`. |
| `services/geo.service.ts` | Haversine y estimación de tiempo. |
| `constants/cali-hospitals.constant.ts` | Los 12 hospitales y las etiquetas. |
| `interfaces/hospital.interface.ts` | Tipo `Hospital` y capacidades. |
| `interfaces/geo-point.interface.ts` | Un punto geográfico. |

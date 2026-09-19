# `simulator/` — el generador de llamadas

## Para qué sirve

Es el motor de la demostración: crea llamadas de emergencia ficticias desde
**direcciones reales de Cali**, para ver el flujo completo sin un centro
regulador de verdad conectado.

## Cómo genera una llamada

Combina un **guion ficticio** con una **dirección real** elegida al azar entre
las 17 del catálogo. Por eso cada caso llega desde un punto distinto de la
ciudad y el despacho tiene que elegir de verdad entre hospitales.

Hay 15 guiones escritos como habla la gente al llamar a emergencias:
incompletos, con ruido, a veces sin la información clave. Es a propósito — eso
es lo que hace difícil el triaje y lo que justifica usar Jev en vez de buscar
palabras clave.

**Ninguno contiene nombres, teléfonos ni datos personales reales.**

## Dos ritmos

| Trabajo | Cadencia | Variable |
|---|---|---|
| Entran llamadas | cada 45 s | `SIMULATOR_CREATE_SECONDS` |
| Las ambulancias avanzan | cada 5 s | `SIMULATOR_ADVANCE_SECONDS` |

Están separados para que se vea movimiento constante sin esperar a la siguiente
llamada. Ambos se pausan desde la interfaz, y el botón *Generar llamada*
dispara una de inmediato.

Hay un tope de 12 emergencias activas, para no saturar la pantalla.

## Repetir una demostración

`SIMULATOR_SEED` con cualquier texto fija la semilla (mulberry32): con la misma
semilla, la secuencia de guiones, direcciones y posiciones de flota es
idéntica. Útil para depurar. No es un generador criptográfico.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `simulator.service.ts` | Genera una llamada y la entrega a la cadena. |
| `simulator.scheduler.ts` | Los dos intervalos. |
| `simulator.controller.ts` | `POST /simulator/call`, `/pause`, `/resume`, `GET /state`. |
| `services/random.service.ts` | Aleatoriedad con semilla opcional. |
| `constants/cali-addresses.constant.ts` | Las 17 direcciones reales. |
| `constants/call-scripts.constant.ts` | Los 15 guiones ficticios. |
| `interfaces/simulator-state.interface.ts` | Estado expuesto por la API. |

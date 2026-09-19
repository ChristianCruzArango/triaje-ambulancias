# `ambulances/` — la flota y su movimiento

## Para qué sirve

Mantiene las ambulancias, su estado y su posición, y las mueve por el mapa.

## Reparto aleatorio

Al arrancar, las 8 unidades se reparten **al azar** dentro de la caja
geográfica de Cali, así cada demostración empieza distinta. `POST
/ambulances/redeploy` vuelve a repartirlas.

La mitad son **TAM** (medicalizadas) y la mitad **TAB** (básicas). Un caso
crítico o que Jev marque como `needs_medicalized_unit` exige una TAM: si no hay
ninguna libre, el despacho lo dice en vez de mandar una unidad que no sirve.

## Por qué vive en memoria

Es estado operativo volátil de la demostración, no un registro histórico. Lo
que sí se persiste es la emergencia y a qué ambulancia se asignó.

## El movimiento

`services/ambulance-movement.service.ts` avanza cada unidad una fracción del
camino por tick: primero al incidente, después al hospital. Al llegar cambia de
estado y la emergencia avanza con ella, hasta cerrarse.

Es interpolación en línea recta, no ruta por calles.

## Estados

`disponible → en_camino → trasladando → (entrega) → disponible`

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `ambulances.service.ts` | La flota, su despliegue y sus cambios de estado. |
| `ambulances.controller.ts` | `GET /ambulances`, `POST /ambulances/redeploy`. |
| `services/ambulance-movement.service.ts` | Un paso de movimiento por tick. |
| `constants/fleet.constant.ts` | Tamaño de flota, caja de Cali y etiquetas. |
| `constants/movement.constant.ts` | Paso y umbral de llegada. |
| `interfaces/ambulance.interface.ts` | Tipo `Ambulance` y estados. |

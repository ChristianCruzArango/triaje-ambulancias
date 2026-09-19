# Frontend — sala de control de emergencias de Cali

Angular 22, componentes standalone y señales. El mapa ocupa la pantalla
completa y los paneles flotan encima.

## Dónde está cada cosa

```
src/app/
  core/                    infraestructura compartida
    api/                   cliente HTTP + interfaces/
    maps/                  carga del script de Maps JavaScript API
    models/                el CONTRATO con el backend (solo tipos)
    realtime/              Socket.IO + constants/ + interfaces/
    state/                 store de señales
  features/                una carpeta por pieza, cada una con README
    control-room/          la pantalla: une todas las demás
    call-console/          botón, micrófono y cuadro de transcripción
    live-map/              mapa, ambulancias, hospitales, incidentes
    jev-inspector/         qué se envía a Jev, qué responde, tiempo y coste
    dispatch-panel/        el beneficio: qué hospital y por qué
    emergencies-list/      listado vivo de llamadas
    top-bar/               estado, totales y controles
  shared/
    pipes/                 formato de coste
```

## Reglas de organización

- **Interfaces en `interfaces/`**, constantes en `constants/`, servicios en
  `services/`. Nunca mezclados dentro de un componente ni en un archivo de
  tipos.
- **Nada codificado a mano**: clave de Maps, endpoint, librerías, `mapId`,
  centro y zoom salen de `environments/`. Colores, duraciones y textos viven en
  archivos de `constants/`.
- `core/models/emergency.model.ts` es **solo tipos**, espejo de
  `backend/src/emergencies/interfaces/emergency-dto.interface.ts`.

## Las cuatro cosas que la pantalla tiene que mostrar

1. **Lo que se transcribe** — consola de llamadas, en vivo mientras se habla.
2. **Lo que se envía a Jev** — el JSON exacto, en el inspector.
3. **La clasificación** — servicio requerido, confianza y las ocho banderas.
4. **El tiempo de respuesta** — de Jev (~300 ms) y del despacho (<1 ms).

Y encima de todo eso, **el beneficio**: cuando el hospital más cercano no era
el correcto, el panel de despacho lo dice con nombre y distancia.

## Cómo fluyen los datos

```
EmergenciesStore.start()
   ├─ GET /emergencies, /ambulances, /hospitals, /stats/ai   ← la verdad
   └─ Socket.IO                                               ← los deltas
```

Ningún componente pide datos por su cuenta: todos leen señales del store. Al
reconectar el socket, el store recarga todo por HTTP.

## Voz

`call-console/` usa las APIs del navegador: `SpeechRecognition` para
transcribir (gratis, sin clave) y `speechSynthesis` para leer en voz alta las
llamadas simuladas. Funciona en Chrome.

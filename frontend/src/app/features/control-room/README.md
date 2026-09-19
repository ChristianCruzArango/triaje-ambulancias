# `control-room/` — la pantalla principal

## Para qué sirve

Une todo. El mapa ocupa la pantalla y los paneles flotan encima.

```
┌──────────────────────────────────────────────────────────┐
│ top-bar: demo · conexión · Jev · despacho · controles    │
├──────────────┬────────────────────────┬──────────────────┤
│ CONSOLA      │                        │  JEV INSPECTOR   │
│ · botón      │                        │  · qué se envía  │
│ · micrófono  │    MAPA DE CALI        │  · qué responde  │
│ · transcrip. │    ambulancias         │  · tiempo/coste  │
├──────────────┤    hospitales          ├──────────────────┤
│ EMERGENCIAS  │    incidentes          │  DESPACHO        │
│ (lista viva) │                        │  · el beneficio  │
└──────────────┴────────────────────────┴──────────────────┘
```

## Cómo fluye

`ControlRoom` llama a `EmergenciesStore.start()` una vez. El store carga por
HTTP, abre el WebSocket y aplica los deltas. Los paneles solo leen señales.

Al reconectar, el store recarga todo por HTTP: durante la caída se perdieron
eventos.

## La secuencia que se ve en pantalla

1. Entra la llamada → aparece el incidente **en gris** y se oye el audio.
2. Se transcribe en el cuadro de la consola.
3. **Jev responde** → el incidente cambia al color de su prioridad y se llena
   el inspector.
4. **El despacho elige** → sale la ambulancia, se resalta el hospital, y si el
   más cercano no servía, aparece el recuadro azul.

Cada paso llega por un evento distinto del WebSocket. Ese escalonado es lo que
hace visible dónde interviene cada pieza.

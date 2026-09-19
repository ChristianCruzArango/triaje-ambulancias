/**
 * NOTA SOBRE EL ESTILO DEL MAPA
 *
 * Google Maps ignora `styles` cuando hay un `mapId`, y el `mapId` es
 * obligatorio para los marcadores avanzados que usa este proyecto. El estilo
 * oscuro se configura entonces en Google Cloud Console, asociado al `mapId`,
 * no aquí. Se deja esta nota para que nadie vuelva a añadir `styles`.
 */

/** Zoom al que se acerca el mapa cuando entra una llamada nueva. */
export const INCIDENT_FOCUS_ZOOM = 15;

/** Zoom al fijar una ambulancia para seguirla. */
export const AMBULANCE_FOLLOW_ZOOM = 16;

/** Margen en píxeles al encuadrar incidente y hospital. */
export const ROUTE_BOUNDS_PADDING = 140;

/**
 * Duración del desplazamiento animado de una ambulancia, en ms.
 *
 * DEBE coincidir con el intervalo con el que el backend mueve la flota
 * (`SIMULATOR_ADVANCE_SECONDS`, hoy 1 s). Si la animación dura más que el
 * intervalo, nunca termina: cada posición nueva la corta a media
 * interpolación y el marcador se ve a tirones y siempre rezagado.
 */
export const AMBULANCE_TWEEN_MS = 1000;

/** Trazos del recorrido de despacho. */
export const ROUTE_STROKE = {
  toIncident: { color: '#f97316', weight: 3 },
  toHospital: { color: '#38bdf8', weight: 3 },
} as const;

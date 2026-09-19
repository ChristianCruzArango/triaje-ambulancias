/**
 * Fracción del camino restante que recorre una ambulancia en cada tick.
 *
 * Con ticks de 1 segundo, 0,06 hace que un trayecto se complete en unos
 * 20–30 segundos: suficiente para verlo avanzar sin que la demostración se
 * haga lenta. Subirlo acelera el movimiento.
 */
export const STEP_FRACTION = 0.06;

/**
 * Paso mínimo en grados, para que no se quede arrastrándose al final.
 * La interpolación por fracción se vuelve cada vez más pequeña al acercarse.
 */
export const MIN_STEP_DEGREES = 0.0012;

/**
 * A esta distancia se considera que llegó, en kilómetros.
 *
 * Al alcanzarla, la unidad se coloca EXACTAMENTE sobre el punto de destino
 * antes de cambiar de estado. Si no, se quedaría congelada a esta distancia
 * del hospital: una vez liberada ya no tiene hacia dónde avanzar.
 */
export const ARRIVAL_THRESHOLD_KM = 0.25;

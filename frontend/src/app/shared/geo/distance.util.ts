/**
 * Distancia en línea recta entre dos puntos, en kilómetros (haversine).
 *
 * ⚠️ Esto es SOLO PARA MOSTRAR. La decisión de qué ambulancia se despacha la
 * toma el backend (`dispatch/`), que es la autoridad. Aquí se recalcula para
 * poder ordenar la flota en pantalla mientras se mueve, sin pedirle al
 * servidor una lista nueva cada segundo.
 */
const EARTH_RADIUS_KM = 6371;

export interface LatLng {
  latitude: number;
  longitude: number;
}

export function distanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 *
      Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude));

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Minutos estimados, por velocidad media urbana. */
export function etaMinutes(km: number, averageKmh = 35): number {
  return Math.max(1, Math.round((km / averageKmh) * 60));
}

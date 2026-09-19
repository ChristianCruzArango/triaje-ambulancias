import { Injectable } from '@nestjs/common';
import type { GeoPoint } from '../interfaces/geo-point.interface.js';

/**
 * Cálculos de distancia.
 *
 * Esto es ARITMÉTICA y vive en código a propósito: jev-1.13 no compara
 * magnitudes numéricas de forma fiable, así que nunca se le pregunta "cuál
 * está más cerca".
 * https://docs.typesafe.ai/model-jaggedness/jev-1.13#math-and-numbers
 */
@Injectable()
export class GeoService {
  private static readonly EARTH_RADIUS_KM = 6371;

  /** Distancia en línea recta, en kilómetros (fórmula de haversine). */
  distanceKm(a: GeoPoint, b: GeoPoint): number {
    const dLat = this.toRad(b.latitude - a.latitude);
    const dLon = this.toRad(b.longitude - a.longitude);
    const lat1 = this.toRad(a.latitude);
    const lat2 = this.toRad(b.latitude);

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

    return 2 * GeoService.EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
  }

  /**
   * Minutos estimados de recorrido.
   * Aproximación por velocidad media urbana; no es una ruta por calles.
   */
  etaMinutes(distanceKm: number, averageKmh = 35): number {
    return Math.max(1, Math.round((distanceKm / averageKmh) * 60));
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

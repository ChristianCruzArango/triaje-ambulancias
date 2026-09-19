import { Injectable } from '@angular/core';
import { AMBULANCE_TWEEN_MS } from '../constants/map-style.constant';

/**
 * Mueve un marcador de forma progresiva en vez de teletransportarlo.
 */
@Injectable({ providedIn: 'root' })
export class MarkerAnimationService {
  tween(
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral,
    apply: (position: google.maps.LatLngLiteral) => void,
  ): number {
    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / AMBULANCE_TWEEN_MS, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      apply({
        lat: from.lat + (to.lat - from.lat) * eased,
        lng: from.lng + (to.lng - from.lng) * eased,
      });

      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return frame;
  }

  /** `true` si va hacia el oeste: se voltea el dibujo. */
  facesWest(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral): boolean {
    return to.lng < from.lng;
  }
}

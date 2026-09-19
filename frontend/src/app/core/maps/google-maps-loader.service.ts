import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Carga el script de Maps JavaScript API una sola vez y expone el estado.
 *
 * Toda la configuración (endpoint, clave, librerías, versión, idioma y región)
 * vive en `environments/`. Aquí no hay nada codificado a mano.
 */
@Injectable({ providedIn: 'root' })
export class GoogleMapsLoader {
  readonly loaded = signal(false);
  readonly failed = signal(false);
  private pending?: Promise<void>;

  load(): Promise<void> {
    if (this.pending) return this.pending;

    this.pending = new Promise<void>((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        this.loaded.set(true);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.buildScriptUrl();
      script.async = true;
      script.onload = () => {
        this.loaded.set(true);
        resolve();
      };
      script.onerror = () => {
        this.failed.set(true);
        reject(new Error('No se pudo cargar Google Maps'));
      };
      document.head.appendChild(script);
    });

    return this.pending;
  }

  private buildScriptUrl(): string {
    const params = new URLSearchParams({
      key: environment.googleMapsApiKey,
      libraries: environment.googleMapsLibraries,
      v: environment.googleMapsVersion,
      language: environment.googleMapsLanguage,
      region: environment.googleMapsRegion,
    });
    return `${environment.googleMapsScriptUrl}?${params}`;
  }
}

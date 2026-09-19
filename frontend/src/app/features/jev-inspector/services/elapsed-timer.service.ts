import { Injectable, OnDestroy, signal } from '@angular/core';

/**
 * Cronómetro que arranca en 0 y corre mientras se espera una respuesta.
 *
 * Existe para que se VEA el flujo: al entrar una llamada el contador empieza
 * en 0 y sube, en vez de aparecer de golpe con el número final. Cuando llega
 * la respuesta, el panel muestra el tiempo medido de verdad por el backend.
 */
@Injectable()
export class ElapsedTimerService implements OnDestroy {
  /** Milisegundos transcurridos desde que se arrancó. */
  readonly elapsedMs = signal(0);
  readonly running = signal(false);

  private handle?: ReturnType<typeof setInterval>;
  private startedAt = 0;

  /** Cada cuánto se refresca el contador, en ms. */
  private static readonly TICK_MS = 50;

  start(): void {
    this.stop();
    this.startedAt = Date.now();
    this.elapsedMs.set(0);
    this.running.set(true);
    this.handle = setInterval(() => {
      this.elapsedMs.set(Date.now() - this.startedAt);
    }, ElapsedTimerService.TICK_MS);
  }

  stop(): void {
    if (this.handle) clearInterval(this.handle);
    this.handle = undefined;
    this.running.set(false);
  }

  ngOnDestroy(): void {
    this.stop();
  }
}

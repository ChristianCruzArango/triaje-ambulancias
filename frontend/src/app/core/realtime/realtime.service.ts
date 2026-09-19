import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { REALTIME_EVENTS } from './constants/realtime-events.constant';
import type {
  EmergencyDispatchedPayload,
  EmergencyReceivedPayload,
  EmergencyTriagedPayload,
  FleetUpdatedPayload,
} from './interfaces/realtime-payloads.interface';

/**
 * Conexión Socket.IO.
 *
 * Transmite CAMBIOS, no es la fuente de verdad: `reconnected$` avisa cuando
 * hay que recargar todo por HTTP, porque durante la caída se perdieron eventos.
 */
@Injectable({ providedIn: 'root' })
export class RealtimeService {
  readonly connected = signal(false);

  readonly received$ = new Subject<EmergencyReceivedPayload>();
  readonly triaged$ = new Subject<EmergencyTriagedPayload>();
  readonly dispatched$ = new Subject<EmergencyDispatchedPayload>();
  readonly fleet$ = new Subject<FleetUpdatedPayload>();
  readonly reconnected$ = new Subject<void>();

  private socket?: Socket;
  private hadConnected = false;

  connect(): void {
    if (this.socket) return;

    this.socket = io(environment.wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.connected.set(true);
      if (this.hadConnected) this.reconnected$.next();
      this.hadConnected = true;
    });
    this.socket.on('disconnect', () => this.connected.set(false));

    this.socket.on(REALTIME_EVENTS.emergencyReceived, (p: EmergencyReceivedPayload) => this.received$.next(p));
    this.socket.on(REALTIME_EVENTS.emergencyTriaged, (p: EmergencyTriagedPayload) => this.triaged$.next(p));
    this.socket.on(REALTIME_EVENTS.emergencyDispatched, (p: EmergencyDispatchedPayload) => this.dispatched$.next(p));
    this.socket.on(REALTIME_EVENTS.fleetUpdated, (p: FleetUpdatedPayload) => this.fleet$.next(p));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}

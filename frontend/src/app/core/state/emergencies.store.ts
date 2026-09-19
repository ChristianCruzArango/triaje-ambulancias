import { Injectable, computed, inject, signal } from '@angular/core';
import { EmergenciesApiService } from '../api/emergencies-api.service';
import type { CaliAddress } from '../api/interfaces/cali-address.interface';
import type { SimulatorState } from '../api/interfaces/simulator-state.interface';
import type {
  AiStats,
  Ambulance,
  Emergency,
  Hospital,
} from '../models/emergency.model';
import { RealtimeService } from '../realtime/realtime.service';

/**
 * Estado de la sala de control.
 *
 * El socket aplica deltas; la verdad es la API. Al reconectar se recarga todo.
 */
@Injectable({ providedIn: 'root' })
export class EmergenciesStore {
  private readonly api = inject(EmergenciesApiService);
  private readonly realtime = inject(RealtimeService);


  readonly emergencies = signal<Emergency[]>([]);
  readonly ambulances = signal<Ambulance[]>([]);
  readonly hospitals = signal<Hospital[]>([]);
  readonly addresses = signal<CaliAddress[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly stats = signal<AiStats | null>(null);
  readonly simulator = signal<SimulatorState | null>(null);
  readonly apiDown = signal(false);

  /**
   * Id de la llamada que ACABA de entrar por WebSocket.
   *
   * Existe para distinguir una llamada nueva de las que se cargan del
   * historial por HTTP: solo las nuevas se anuncian en voz alta. Al recargar
   * la página queda en `null`, así que la app arranca en silencio.
   */
  readonly incomingCallId = signal<string | null>(null);

  /**
   * Ambulancia que el mapa debe seguir. Al fijarla, el mapa la centra y la
   * mantiene a la vista mientras se mueve, hasta que se elija otra cosa.
   */
  readonly followedAmbulanceId = signal<string | null>(null);

  readonly connected = this.realtime.connected;

  readonly selected = computed(
    () => this.emergencies().find((e) => e.id === this.selectedId()) ?? null,
  );

  /** Emergencias que siguen abiertas. */
  readonly activeEmergencies = computed(() =>
    this.emergencies().filter((e) => e.status !== 'CERRADA'),
  );

  readonly reviewCount = computed(
    () => this.emergencies().filter((e) => e.status === 'REVISION').length,
  );

  /** Cuántas veces el hospital más cercano NO fue el elegido. */
  readonly overruledCount = computed(
    () => this.emergencies().filter((e) => e.nearestOverruled).length,
  );

  start(): void {
    this.reloadAll();
    this.realtime.connect();

    this.realtime.received$.subscribe(({ emergency }) => {
      this.upsert(emergency);
      // Una llamada nueva pasa al frente: es lo que hay que mirar.
      this.selectedId.set(emergency.id);
      // Y solo esta se anuncia en voz alta, no las del historial.
      this.incomingCallId.set(emergency.id);
    });
    this.realtime.triaged$.subscribe(({ emergency }) => {
      this.upsert(emergency);
      this.loadStats();
    });
    this.realtime.dispatched$.subscribe(({ emergency, ambulances }) => {
      this.upsert(emergency);
      this.ambulances.set(ambulances);
      this.loadStats();
    });
    this.realtime.fleet$.subscribe(({ ambulances }) => this.ambulances.set(ambulances));

    this.realtime.reconnected$.subscribe(() => this.reloadAll());
  }

  reloadAll(): void {
    this.api.list().subscribe({
      next: (rows) => {
        this.emergencies.set(rows);
        this.apiDown.set(false);
        if (!this.selectedId() && rows.length) this.selectedId.set(rows[0].id);
      },
      error: () => this.apiDown.set(true),
    });
    this.api.getAmbulances().subscribe({ next: (a) => this.ambulances.set(a), error: () => {} });
    this.api.getHospitals().subscribe({ next: (h) => this.hospitals.set(h), error: () => {} });
    this.api.getAddresses().subscribe({ next: (a) => this.addresses.set(a), error: () => {} });
    this.api.getSimulatorState().subscribe({ next: (s) => this.simulator.set(s), error: () => {} });
    this.loadStats();
  }

  select(id: string): void {
    this.selectedId.set(id);
    // Elegir otra emergencia deja de seguir la ambulancia anterior.
    this.followedAmbulanceId.set(null);
  }

  /** Fija o suelta la ambulancia que sigue el mapa. */
  toggleFollow(ambulanceId: string): void {
    this.followedAmbulanceId.update((current) =>
      current === ambulanceId ? null : ambulanceId,
    );
  }

  private loadStats(): void {
    this.api.getAiStats().subscribe({ next: (s) => this.stats.set(s), error: () => {} });
  }

  private upsert(emergency: Emergency): void {
    this.emergencies.update((rows) => {
      const index = rows.findIndex((r) => r.id === emergency.id);
      if (index === -1) return [emergency, ...rows];
      const copy = [...rows];
      copy[index] = emergency;
      return copy;
    });
  }

  // ── Controles ──

  generateCall(): void {
    this.api.generateCall().subscribe({ error: () => {} });
  }

  /** Alta desde el micrófono. */
  submitVoiceCall(body: {
    reportText: string;
    addressLabel: string;
    latitude: number;
    longitude: number;
  }): void {
    this.api.create({ ...body, source: 'voz' }).subscribe({ error: () => {} });
  }

  redeployFleet(): void {
    this.api.redeployFleet().subscribe({
      next: (a) => this.ambulances.set(a),
      error: () => {},
    });
  }

  togglePause(): void {
    const paused = this.simulator()?.paused ?? false;
    const call = paused ? this.api.resume() : this.api.pause();
    call.subscribe({ next: (s) => this.simulator.set(s), error: () => {} });
  }
}

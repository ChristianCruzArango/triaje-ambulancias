import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { Emergency } from '../../../core/models/emergency.model';
import { Modal } from '../../../shared/modal/modal';
import type { FleetRow } from '../interfaces/fleet-row.interface';

/**
 * Explica cómo se mide la distancia de cada ambulancia al incidente, con los
 * números reales de este caso.
 */
@Component({
  selector: 'app-fleet-explain-modal',
  imports: [DecimalPipe, Modal],
  templateUrl: './fleet-explain-modal.html',
  styleUrl: './fleet-explain-modal.scss',
})
export class FleetExplainModal {
  readonly emergency = input.required<Emergency>();
  readonly rows = input.required<FleetRow[]>();
  readonly closed = output<void>();

  /** La más cercana de todas, sirva o no. */
  protected readonly nearestOverall = computed(() => this.rows()[0] ?? null);

  /** La que efectivamente salió. */
  protected readonly assigned = computed(
    () => this.rows().find((r) => r.isAssigned) ?? null,
  );

  /** `true` si la más cercana no fue la despachada. */
  protected readonly nearestWasSkipped = computed(() => {
    const nearest = this.nearestOverall();
    const assigned = this.assigned();
    return !!nearest && !!assigned && nearest.ambulance.id !== assigned.ambulance.id;
  });

  /** Por qué se saltó la más cercana. */
  protected readonly skipReason = computed(() => {
    const nearest = this.nearestOverall();
    if (!nearest) return null;
    if (nearest.ambulance.status !== 'disponible') {
      return `Estaba ${nearest.ambulance.status.replace('_', ' ')} en otra emergencia.`;
    }
    if (nearest.ambulance.type === 'TAB' && this.requiresMedicalized()) {
      return 'Es una unidad básica (TAB) y este caso exige una medicalizada (TAM).';
    }
    return null;
  });

  protected readonly requiresMedicalized = computed(() => {
    const e = this.emergency();
    const flag = e.assessment?.flags.needsMedicalized ?? 0;
    return flag >= 0.5 || e.priority === 'critica';
  });

  /** Las coordenadas que entran al cálculo. */
  protected readonly inputJson = computed(() => {
    const e = this.emergency();
    return JSON.stringify(
      {
        incidente: { lat: e.latitude, lng: e.longitude },
        flota: this.rows().map((r) => ({
          code: r.ambulance.code,
          tipo: r.ambulance.type,
          estado: r.ambulance.status,
          lat: r.ambulance.latitude,
          lng: r.ambulance.longitude,
          distanciaKm: Number(r.distanceKm.toFixed(3)),
        })),
      },
      null,
      2,
    );
  });
}

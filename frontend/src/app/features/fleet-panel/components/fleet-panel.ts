import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import { AMBULANCE_STATUS_LABELS } from '../../live-map/constants/priority-colors.constant';
import { distanceKm, etaMinutes } from '../../../shared/geo/distance.util';
import type { FleetRow } from '../interfaces/fleet-row.interface';
import { FleetExplainModal } from './fleet-explain-modal';

/**
 * La flota ordenada por distancia al incidente seleccionado.
 *
 * Hace visible por qué se eligió una ambulancia y no otra: se ve la más
 * cercana, la más lejana, y cuáles estaban ocupadas.
 */
@Component({
  selector: 'app-fleet-panel',
  imports: [DecimalPipe, FleetExplainModal],
  templateUrl: './fleet-panel.html',
  styleUrl: './fleet-panel.scss',
})
export class FleetPanel {
  private readonly store = inject(EmergenciesStore);

  protected readonly statusLabels = AMBULANCE_STATUS_LABELS;
  /** Abre la explicación del cálculo de distancias. */
  protected readonly modalOpen = signal(false);

  protected readonly emergency = this.store.selected;
  protected readonly followedId = this.store.followedAmbulanceId;

  /** Fija esta ambulancia en el mapa, o la suelta si ya estaba fijada. */
  protected follow(ambulanceId: string): void {
    this.store.toggleFollow(ambulanceId);
  }

  /** La flota ordenada por cercanía al incidente. Se recalcula al moverse. */
  protected readonly rows = computed<FleetRow[]>(() => {
    const target = this.emergency();
    const fleet = this.store.ambulances();
    if (!target || !fleet.length) return [];

    const withDistance = fleet.map((ambulance) => {
      const km = distanceKm(ambulance, target);
      return {
        ambulance,
        distanceKm: km,
        etaMinutes: etaMinutes(km),
        isNearest: false,
        isFarthest: false,
        isAssigned: ambulance.code === target.ambulanceCode,
      };
    });

    withDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    // La más cercana entre las que podían ir.
    const firstAvailable = withDistance.find(
      (r) => r.ambulance.status === 'disponible' || r.isAssigned,
    );
    if (firstAvailable) firstAvailable.isNearest = true;
    withDistance[withDistance.length - 1].isFarthest = true;

    return withDistance;
  });

  protected readonly nearest = computed(() => this.rows().find((r) => r.isNearest) ?? null);
  protected readonly farthest = computed(() => this.rows().at(-1) ?? null);
}

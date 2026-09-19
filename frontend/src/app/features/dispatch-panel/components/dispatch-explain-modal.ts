import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import type {
  Emergency,
  HospitalCandidate,
} from '../../../core/models/emergency.model';
import { Modal } from '../../../shared/modal/modal';

/**
 * Explica el algoritmo de despacho con los datos reales de este caso: qué
 * recibió, cómo filtró, cómo ordenó y por qué salió ese hospital.
 */
@Component({
  selector: 'app-dispatch-explain-modal',
  imports: [DecimalPipe, PercentPipe, Modal],
  templateUrl: './dispatch-explain-modal.html',
  styleUrl: './dispatch-explain-modal.scss',
})
export class DispatchExplainModal {
  readonly emergency = input.required<Emergency>();
  readonly closed = output<void>();

  protected readonly candidates = computed<HospitalCandidate[]>(
    () => this.emergency().hospitalCandidates ?? [],
  );

  protected readonly eligible = computed(() =>
    this.candidates().filter((c) => c.eligible),
  );

  protected readonly rejected = computed(() =>
    this.candidates().filter((c) => !c.eligible),
  );

  /** Lo que el despacho recibe como entrada. */
  protected readonly inputJson = computed(() => {
    const e = this.emergency();
    return JSON.stringify(
      {
        incidentLat: e.latitude,
        incidentLng: e.longitude,
        requiredCapability: e.assessment?.requiredCapability ?? null,
        priority: e.priority,
        requiresMedicalizedUnit: (e.assessment?.flags.needsMedicalized ?? 0) >= 0.5,
      },
      null,
      2,
    );
  });

  /** Lo que devuelve, recortado a lo relevante. */
  protected readonly outputJson = computed(() => {
    const e = this.emergency();
    return JSON.stringify(
      {
        ambulanceCode: e.ambulanceCode,
        hospitalCode: e.hospitalCode,
        hospitalDistanceKm: e.hospitalDistanceKm,
        nearestOverruled: e.nearestOverruled,
        blockedReason: e.blockedReason,
        latencyMs: e.dispatchLatencyMs,
        candidates: this.candidates(),
      },
      null,
      2,
    );
  });

  protected readonly capabilityProbability = computed(() => {
    const a = this.emergency().assessment;
    if (!a?.capabilityProbabilities) return null;
    return a.capabilityProbabilities[a.requiredCapability] ?? null;
  });
}

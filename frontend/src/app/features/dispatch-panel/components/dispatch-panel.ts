import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, LowerCasePipe, PercentPipe } from '@angular/common';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import { DispatchExplainModal } from './dispatch-explain-modal';

/**
 * Explica **cómo** se llegó a la decisión de despacho, paso a paso.
 *
 * No basta con decir a qué hospital va: hay que mostrar qué probabilidad dio
 * Jev, cuántos hospitales se filtraron con ese dato y por qué quedó ese.
 */
@Component({
  selector: 'app-dispatch-panel',
  imports: [DecimalPipe, LowerCasePipe, PercentPipe, DispatchExplainModal],
  templateUrl: './dispatch-panel.html',
  styleUrl: './dispatch-panel.scss',
})
export class DispatchPanel {
  private readonly store = inject(EmergenciesStore);

  /** Abre la explicación completa del algoritmo. */
  protected readonly modalOpen = signal(false);

  protected readonly emergency = this.store.selected;

  protected readonly candidates = computed(
    () => this.emergency()?.hospitalCandidates ?? [],
  );

  protected readonly eligible = computed(
    () => this.candidates().filter((c) => c.eligible),
  );

  protected readonly rejected = computed(
    () => this.candidates().filter((c) => !c.eligible),
  );

  /** El más cercano en términos absolutos, sirva o no. */
  protected readonly nearestOverall = computed(() => this.candidates()[0] ?? null);

  /** El servicio que pidió Jev, con su probabilidad. */
  protected readonly capability = computed(() => {
    const a = this.emergency()?.assessment;
    if (!a) return null;
    return {
      label: a.requiredCapabilityLabel,
      key: a.requiredCapability,
      confidence: a.capabilityConfidence,
      probability: a.capabilityProbabilities?.[a.requiredCapability] ?? null,
    };
  });
}

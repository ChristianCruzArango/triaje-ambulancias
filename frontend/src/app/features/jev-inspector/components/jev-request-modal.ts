import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { TriageAssessment } from '../../../core/models/emergency.model';
import { Modal } from '../../../shared/modal/modal';
import { CostPipe } from '../../../shared/pipes/cost.pipe';

/**
 * La petición a Jev, completa y sin adornos: a dónde va, qué lleva, qué
 * devuelve y de dónde sale cada cosa en el repositorio.
 */
@Component({
  selector: 'app-jev-request-modal',
  imports: [DecimalPipe, Modal, CostPipe],
  templateUrl: './jev-request-modal.html',
  styleUrl: './jev-request-modal.scss',
})
export class JevRequestModal {
  readonly assessment = input.required<TriageAssessment>();
  readonly reportText = input.required<string>();
  readonly closed = output<void>();

  /** El cuerpo exacto de la petición, tal como lo arma el SDK. */
  protected readonly requestBody = computed(() =>
    JSON.stringify(
      {
        model: 'jev-latest',
        state: this.assessment().sentState,
        questions: this.assessment().sentQuestions,
      },
      null,
      2,
    ),
  );

  protected readonly responseBody = computed(() =>
    JSON.stringify(this.assessment().rawResponse ?? {}, null, 2),
  );

  protected readonly headersText = computed(() => {
    const e = this.assessment().endpoint;
    return Object.entries(e.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
  });
}

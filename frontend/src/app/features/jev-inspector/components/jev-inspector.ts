import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from '../../live-map/constants/priority-colors.constant';
import { CostPipe } from '../../../shared/pipes/cost.pipe';
import { JevRequestModal } from './jev-request-modal';
import { ElapsedTimerService } from '../services/elapsed-timer.service';
import {
  CAPABILITY_QUESTION,
  FLAG_QUESTION_BY_KEY,
  FLAG_RAISED_THRESHOLD,
  readNoul,
} from '../constants/triage-questions-es.constant';

/**
 * Muestra la evaluación de Jev de forma legible: qué se le envió, qué le
 * preguntó, qué respondió a cada pregunta, cuánto tardó y cuánto costó.
 *
 * Las preguntas se muestran en español aunque viajen en inglés.
 */
@Component({
  selector: 'app-jev-inspector',
  imports: [DecimalPipe, PercentPipe, CostPipe, JevRequestModal],
  providers: [ElapsedTimerService],
  templateUrl: './jev-inspector.html',
  styleUrl: './jev-inspector.scss',
})
export class JevInspector {
  private readonly store = inject(EmergenciesStore);
  private readonly timer = inject(ElapsedTimerService);

  /** Contador en vivo mientras se espera a Jev. */
  protected readonly elapsedMs = this.timer.elapsedMs;
  protected readonly waiting = this.timer.running;

  protected readonly priorityColors = PRIORITY_COLORS;
  protected readonly priorityLabels = PRIORITY_LABELS;
  protected readonly capabilityQuestion = CAPABILITY_QUESTION;
  protected readonly raisedThreshold = FLAG_RAISED_THRESHOLD;

  /** Abre la traza completa de la petición. */
  protected readonly modalOpen = signal(false);

  protected readonly emergency = this.store.selected;
  protected readonly assessment = computed(() => this.emergency()?.assessment ?? null);

  /** Las otras opciones de servicio, con su probabilidad. */
  protected readonly capabilityOptions = computed(() => {
    const a = this.assessment();
    if (!a?.capabilityProbabilities) return [];
    return Object.entries(a.capabilityProbabilities)
      .map(([key, value]) => ({ key, value, chosen: key === a.requiredCapability }))
      .sort((x, y) => y.value - x.value);
  });

  /** Las ocho preguntas noul con su pregunta en español y su lectura. */
  protected readonly flagAnswers = computed(() => {
    const flags = this.assessment()?.flags;
    if (!flags) return [];
    return Object.entries(flags)
      .map(([key, value]) => ({
        key,
        question: FLAG_QUESTION_BY_KEY[key] ?? key,
        value: value as number,
        reading: readNoul(value as number),
        raised: (value as number) >= FLAG_RAISED_THRESHOLD,
      }))
      .sort((a, b) => b.value - a.value);
  });

  /** Cuántas banderas activaron una regla. */
  protected readonly raisedCount = computed(
    () => this.flagAnswers().filter((f) => f.raised).length,
  );

  constructor() {
    // El contador arranca en 0 al entrar la llamada y se detiene cuando Jev
    // responde: así se ve el flujo, no solo el resultado.
    effect(() => {
      const emergency = this.emergency();
      if (!emergency) {
        this.timer.stop();
        return;
      }
      if (emergency.assessment) {
        this.timer.stop();
        return;
      }
      if (!this.timer.running()) this.timer.start();
    });
  }

  protected priorityKey(): string {
    const e = this.emergency();
    if (!e) return 'pendiente';
    if (e.status === 'REVISION') return 'revision';
    return e.priority ?? 'pendiente';
  }
}

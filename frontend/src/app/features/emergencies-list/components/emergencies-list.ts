import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import {
  EMERGENCY_STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from '../../live-map/constants/priority-colors.constant';

/** Listado vivo de emergencias. Filas compactas, no tarjetas. */
@Component({
  selector: 'app-emergencies-list',
  imports: [DatePipe],
  templateUrl: './emergencies-list.html',
  styleUrl: './emergencies-list.scss',
})
export class EmergenciesList {
  private readonly store = inject(EmergenciesStore);

  protected readonly priorityColors = PRIORITY_COLORS;
  protected readonly priorityLabels = PRIORITY_LABELS;
  protected readonly statusLabels = EMERGENCY_STATUS_LABELS;
  protected readonly selectedId = this.store.selectedId;
  protected readonly rows = this.store.emergencies;

  protected select(id: string): void {
    this.store.select(id);
  }

  protected priorityKey(e: { status: string; priority: string | null }): string {
    if (e.status === 'REVISION') return 'revision';
    return e.priority ?? 'pendiente';
  }
}

import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import { CostPipe } from '../../../shared/pipes/cost.pipe';

/** Barra superior: estado, totales de IA y controles. */
@Component({
  selector: 'app-top-bar',
  imports: [DecimalPipe, CostPipe],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  private readonly store = inject(EmergenciesStore);

  protected readonly connected = this.store.connected;
  protected readonly apiDown = this.store.apiDown;
  protected readonly stats = this.store.stats;
  protected readonly simulator = this.store.simulator;
  protected readonly active = this.store.activeEmergencies;
  protected readonly review = this.store.reviewCount;
  protected readonly overruled = this.store.overruledCount;

  protected togglePause(): void { this.store.togglePause(); }
  protected redeploy(): void { this.store.redeployFleet(); }
}

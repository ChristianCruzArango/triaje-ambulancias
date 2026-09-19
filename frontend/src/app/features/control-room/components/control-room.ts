import { Component, inject } from '@angular/core';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import { CallConsole } from '../../call-console/components/call-console';
import { DispatchPanel } from '../../dispatch-panel/components/dispatch-panel';
import { EmergenciesList } from '../../emergencies-list/components/emergencies-list';
import { FleetPanel } from '../../fleet-panel/components/fleet-panel';
import { JevInspector } from '../../jev-inspector/components/jev-inspector';
import { LiveMap } from '../../live-map/components/live-map';
import { TopBar } from '../../top-bar/components/top-bar';

/**
 * Sala de control: el mapa a pantalla completa y los paneles flotando encima.
 */
@Component({
  selector: 'app-control-room',
  imports: [
    LiveMap,
    TopBar,
    CallConsole,
    EmergenciesList,
    FleetPanel,
    JevInspector,
    DispatchPanel,
  ],
  templateUrl: './control-room.html',
  styleUrl: './control-room.scss',
})
export class ControlRoom {
  private readonly store = inject(EmergenciesStore);

  protected readonly selected = this.store.selected;

  constructor() {
    this.store.start();
  }
}

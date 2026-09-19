/** Estado del simulador que expone la API. */
export interface SimulatorState {
  enabled: boolean;
  paused: boolean;
  createSeconds: number;
  advanceSeconds: number;
  seeded: boolean;
}

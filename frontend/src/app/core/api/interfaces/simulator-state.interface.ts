/** Estado del simulador que expone `GET /simulator/state`. */
export interface SimulatorState {
  enabled: boolean;
  paused: boolean;
  createSeconds: number;
  advanceSeconds: number;
  seeded: boolean;
}

import type { Ambulance } from '../../../core/models/emergency.model';

/** Una ambulancia con su distancia al incidente seleccionado. */
export interface FleetRow {
  ambulance: Ambulance;
  distanceKm: number;
  etaMinutes: number;
  /** La más cercana de las disponibles. */
  isNearest: boolean;
  /** La más lejana de la flota. */
  isFarthest: boolean;
  /** La que efectivamente se despachó a esta emergencia. */
  isAssigned: boolean;
}

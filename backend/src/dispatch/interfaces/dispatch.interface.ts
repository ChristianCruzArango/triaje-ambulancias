import type { Hospital } from '../../hospitals/interfaces/hospital.interface.js';

/** Un hospital que se consideró y qué pasó con él. */
export interface HospitalCandidate {
  code: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  /** `true` si tiene la capacidad requerida y camas. */
  eligible: boolean;
  /** Por qué se descartó, si se descartó. Es lo que hace visible a Jev. */
  rejectedReason: string | null;
}

export interface DispatchResult {
  /** `null` si no había ambulancia libre o el caso fue a revisión. */
  ambulanceId: string | null;
  ambulanceCode: string | null;
  ambulanceDistanceKm: number | null;
  ambulanceEtaMinutes: number | null;

  hospitalCode: string | null;
  hospitalName: string | null;
  hospitalDistanceKm: number | null;
  hospitalEtaMinutes: number | null;

  /** Todos los hospitales evaluados, en orden de distancia. */
  candidates: HospitalCandidate[];

  /**
   * El hallazgo que justifica todo el sistema: el hospital más cercano en
   * términos absolutos, cuando NO es el elegido.
   */
  nearestOverruled: {
    code: string;
    name: string;
    distanceKm: number;
    reason: string;
  } | null;

  /** Por qué no se pudo despachar, si no se pudo. */
  blockedReason: string | null;

  /** Milisegundos que tardó el cálculo. Es aritmética: microsegundos. */
  latencyMs: number;
}

export type { Hospital };

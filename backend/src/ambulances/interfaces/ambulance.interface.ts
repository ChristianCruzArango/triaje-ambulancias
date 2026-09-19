/** En qué anda una ambulancia. */
export type AmbulanceStatus =
  /** Libre, esperando asignación. */
  | 'disponible'
  /** Asignada, yendo al lugar del incidente. */
  | 'en_camino'
  /** En el lugar, atendiendo. */
  | 'en_sitio'
  /** Trasladando al paciente hacia el hospital. */
  | 'trasladando'
  /** Entregó al paciente; vuelve a quedar disponible. */
  | 'en_hospital';

/** Nivel de la unidad. Limita qué casos puede atender. */
export type AmbulanceType =
  /** Traslado asistencial básico. */
  | 'TAB'
  /** Traslado asistencial medicalizado. */
  | 'TAM';

export interface Ambulance {
  id: string;
  code: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  latitude: number;
  longitude: number;
  /** Emergencia que atiende ahora, si tiene alguna. */
  emergencyId: string | null;
  /** Hospital de destino cuando está trasladando. */
  hospitalCode: string | null;
}

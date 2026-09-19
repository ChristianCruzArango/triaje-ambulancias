/**
 * Capacidades clínicas de un hospital.
 *
 * Es lo que Jev termina eligiendo indirectamente: Jev dice qué necesita el
 * paciente y el código filtra por esto.
 */
export type HospitalCapability =
  /** Urgencias generales. La tiene cualquiera. */
  | 'urgencias_generales'
  /** Unidad de ataque cerebrovascular con tomógrafo disponible. */
  | 'unidad_acv'
  /** Trauma mayor: politraumatismo, quirófano de urgencia. */
  | 'trauma_mayor'
  /** Hemodinamia para infarto agudo. */
  | 'hemodinamia'
  /** Unidad de quemados. */
  | 'quemados'
  /** Urgencias pediátricas. */
  | 'pediatria'
  /** Obstetricia y parto de urgencia. */
  | 'obstetricia'
  /** Unidad de cuidado intensivo adultos. */
  | 'uci_adultos';

/** Nivel de complejidad, como referencia para la interfaz. */
export type HospitalLevel = 'basico' | 'intermedio' | 'alta_complejidad';

export interface Hospital {
  code: string;
  name: string;
  address: string;
  zone: string;
  latitude: number;
  longitude: number;
  level: HospitalLevel;
  capabilities: HospitalCapability[];
  /** Camas de urgencias disponibles. Dato operativo, no juicio del modelo. */
  availableBeds: number;
}

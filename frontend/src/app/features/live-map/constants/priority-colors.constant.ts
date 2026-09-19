import type { TriagePriority } from '../../../core/models/emergency.model';

/**
 * EL COLOR LO DETERMINA EL PROTOCOLO a partir de las banderas de Jev.
 *
 * Es la señal principal del mapa: mirar y ver de un vistazo qué es crítico.
 */
export type PriorityKey = TriagePriority | 'pendiente' | 'revision';

export const PRIORITY_COLORS: Record<string, string> = {
  critica: '#ef4444',
  alta: '#f97316',
  media: '#eab308',
  baja: '#22c55e',
  /** Jev todavía no ha respondido. */
  pendiente: '#94a3b8',
  /** Requiere que lo mire una persona. */
  revision: '#a855f7',
};

export const PRIORITY_LABELS: Record<string, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
  pendiente: 'Evaluando…',
  revision: 'Revisión humana',
};

/** Estados de ambulancia en español. */
export const AMBULANCE_STATUS_LABELS: Record<string, string> = {
  disponible: 'Disponible',
  en_camino: 'En camino',
  en_sitio: 'En sitio',
  trasladando: 'Trasladando',
  en_hospital: 'En hospital',
};

/** Estados de emergencia en español. */
export const EMERGENCY_STATUS_LABELS: Record<string, string> = {
  RECIBIDA: 'Recibida',
  TRIADA: 'Triada',
  DESPACHADA: 'Despachada',
  EN_SITIO: 'En sitio',
  TRASLADO: 'En traslado',
  CERRADA: 'Cerrada',
  REVISION: 'Revisión humana',
};

/** Nombres legibles de las banderas rojas de Jev. */
export const FLAG_LABELS: Record<string, string> = {
  unresponsive: 'No responde',
  airwayCompromised: 'Vía aérea comprometida',
  severeBleeding: 'Sangrado severo',
  strokeSigns: 'Signos de ACV',
  cardiacChestPain: 'Dolor torácico cardíaco',
  highEnergyTrauma: 'Trauma de alta energía',
  isChild: 'Paciente pediátrico',
  needsMedicalized: 'Requiere unidad medicalizada',
};

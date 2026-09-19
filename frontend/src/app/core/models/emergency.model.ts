// ─────────────────────────────────────────────────────────────────────
// CONTRATO con NestJS. Espejo de
// backend/src/emergencies/interfaces/emergency-dto.interface.ts
// Solo TIPOS: las constantes viven en constants/, no aquí.
// ─────────────────────────────────────────────────────────────────────

export type EmergencyStatus =
  | 'RECIBIDA'
  | 'TRIADA'
  | 'DESPACHADA'
  | 'EN_SITIO'
  | 'TRASLADO'
  | 'CERRADA'
  | 'REVISION';

export type TriagePriority = 'critica' | 'alta' | 'media' | 'baja';

export type RequiredCapability =
  | 'urgencias_generales'
  | 'unidad_acv'
  | 'trauma_mayor'
  | 'hemodinamia'
  | 'quemados'
  | 'pediatria'
  | 'obstetricia';

/** Las ocho banderas rojas que devuelve Jev, cada una 0–1. */
export interface RedFlags {
  unresponsive: number;
  airwayCompromised: number;
  severeBleeding: number;
  strokeSigns: number;
  cardiacChestPain: number;
  highEnergyTrauma: number;
  isChild: number;
  needsMedicalized: number;
}

/** Datos de la llamada HTTP a System One. */
export interface JevEndpoint {
  method: string;
  url: string;
  headers: Record<string, string>;
  /** Dónde viven las preguntas en el repositorio. */
  questionsSource: string;
  /** Dónde vive el cliente. */
  clientSource: string;
  docs: string;
}

export interface TriageAssessment {
  model: string;
  requiredCapability: RequiredCapability;
  requiredCapabilityLabel: string;
  capabilityProbabilities: Record<string, number> | null;
  capabilityConfidence: number | null;
  flags: RedFlags;
  /** El JSON exacto enviado a Jev. */
  sentState: Record<string, unknown> | null;
  /** Las nueve preguntas exactas enviadas. */
  sentQuestions: Record<string, unknown> | null;
  /** La respuesta JSON tal cual la devolvió Jev. */
  rawResponse: unknown;
  /** Cómo se hizo la petición HTTP. */
  endpoint: JevEndpoint;
  latencyMs: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  costUsd: number | null;
  error: string | null;
  createdAt: string;
}

/** Un hospital evaluado y qué pasó con él. */
export interface HospitalCandidate {
  code: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  eligible: boolean;
  /** Por qué se descartó. Es lo que hace visible el aporte de Jev. */
  rejectedReason: string | null;
}

export interface Emergency {
  id: string;
  callCode: string;
  reportText: string;
  source: string;
  addressLabel: string;
  latitude: number;
  longitude: number;
  status: EmergencyStatus;
  priority: TriagePriority | null;
  /** Identificador de la regla del protocolo que disparó. */
  ruleFired: string | null;
  rationale: string | null;
  ambulanceCode: string | null;
  hospitalCode: string | null;
  hospitalName: string | null;
  hospitalDistanceKm: number | null;
  /** El más cercano, cuando NO fue el elegido. */
  nearestOverruled: {
    code: string;
    name: string;
    distanceKm: number;
    reason: string;
  } | null;
  hospitalCandidates: HospitalCandidate[] | null;
  dispatchLatencyMs: number | null;
  blockedReason: string | null;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
  assessment: TriageAssessment | null;
}

export type AmbulanceStatus =
  | 'disponible'
  | 'en_camino'
  | 'en_sitio'
  | 'trasladando'
  | 'en_hospital';

export interface Ambulance {
  id: string;
  code: string;
  type: 'TAB' | 'TAM';
  status: AmbulanceStatus;
  latitude: number;
  longitude: number;
  emergencyId: string | null;
  hospitalCode: string | null;
}

export interface Hospital {
  code: string;
  name: string;
  address: string;
  zone: string;
  latitude: number;
  longitude: number;
  level: 'basico' | 'intermedio' | 'alta_complejidad';
  capabilities: string[];
  availableBeds: number;
}

export interface AiStats {
  jev: {
    calls: number;
    totalCostUsd: number;
    avgLatencyMs: number;
    totalInputTokens: number;
  };
  dispatch: {
    total: number;
    overruledNearest: number;
    humanReview: number;
    avgLatencyMs: number;
  };
}

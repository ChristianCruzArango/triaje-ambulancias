import type { HospitalCandidate } from '../../dispatch/interfaces/dispatch.interface.js';

/** Forma exacta que consume Angular. Espejo del contrato del frontend. */

export interface AssessmentDto {
  model: string;
  requiredCapability: string;
  requiredCapabilityLabel: string;
  capabilityProbabilities: Record<string, number> | null;
  capabilityConfidence: number | null;
  flags: Record<string, number>;
  sentState: unknown;
  sentQuestions: unknown;
  rawResponse: unknown;
  /** Cómo se hizo la petición, para mostrarlo en la interfaz. */
  endpoint: {
    method: string;
    url: string;
    headers: Record<string, string>;
    questionsSource: string;
    clientSource: string;
    docs: string;
  };
  latencyMs: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  costUsd: number | null;
  error: string | null;
  createdAt: string;
}

export interface EmergencyDto {
  id: string;
  callCode: string;
  reportText: string;
  source: string;
  addressLabel: string;
  latitude: number;
  longitude: number;
  status: string;
  priority: string | null;
  ruleFired: string | null;
  rationale: string | null;
  ambulanceCode: string | null;
  hospitalCode: string | null;
  hospitalName: string | null;
  hospitalDistanceKm: number | null;
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
  assessment: AssessmentDto | null;
}

/** Totales de uso de IA para la barra superior. */
export interface AiStatsDto {
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

import type { RedFlags } from '../../triage/interfaces/triage.interface.js';

/** Servicios que puede pedir Jev en `required_capability`. */
export type RequiredCapability =
  | 'urgencias_generales'
  | 'unidad_acv'
  | 'trauma_mayor'
  | 'hemodinamia'
  | 'quemados'
  | 'pediatria'
  | 'obstetricia';

/** Resultado normalizado de una evaluación de triaje. */
export interface TriageAssessmentResult {
  model: string;
  requiredCapability: RequiredCapability;
  capabilityProbabilities: Record<string, number> | null;
  capabilityConfidence: number | null;
  flags: RedFlags;

  // Observabilidad
  sentState: unknown;
  sentQuestions: unknown;
  rawResponse: unknown;
  latencyMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  costUsd: number | null;
  error: string | null;
}

/** Prioridad de triaje. La calcula el protocolo, no el modelo. */
export type TriagePriority = 'critica' | 'alta' | 'media' | 'baja';

/** Qué hace el sistema con el caso. */
export type TriageDecision =
  /** Confianza suficiente y banderas claras: se despacha solo. */
  | 'despachar'
  /** Falta información o la confianza es baja: lo mira una persona. */
  | 'revision_humana';

/** Banderas rojas que devuelve Jev, ya normalizadas a número. */
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

/** Resultado del protocolo: qué prioridad y POR QUÉ. */
export interface TriageOutcome {
  priority: TriagePriority;
  decision: TriageDecision;
  /** Regla concreta que disparó, para poder auditarla. */
  ruleFired: string;
  /** Explicación legible de por qué salió esa prioridad. */
  rationale: string;
  requiresMedicalizedUnit: boolean;
}

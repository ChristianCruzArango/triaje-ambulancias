/**
 * Umbrales de producto.
 *
 * ⚠️ Son un PUNTO DE PARTIDA de la documentación, no valores clínicos
 * validados. En un sistema real los define un protocolo médico y se calibran
 * con casos reales etiquetados por personal clínico.
 * https://docs.typesafe.ai/confidence
 *
 * "Los umbrales escalan con el riesgo": aquí el riesgo es máximo, así que el
 * suelo de confianza es más alto que en un caso de bajo impacto.
 */
export const TRIAGE_CONFIDENCE = {
  /** Por encima: la prioridad se acepta y se despacha. */
  high: 0.75,
  /** Por debajo: no se afirma nada, va a revisión humana. */
  floor: 0.55,
} as const;

/** Umbrales de los noul. Independientes del de confianza: son otra pregunta. */
export const NOUL_THRESHOLDS = {
  /** Por encima, se considera señal de alarma presente. */
  redFlag: 0.6,
  /** Por encima, se exige unidad medicalizada. */
  medicalized: 0.5,
} as const;

/** Prioridades que nunca se despachan solas sin que una persona las vea. */
/** Texto cuando Jev no devolvió confianza. */
export const NO_CONFIDENCE_LABEL = 'sin dato';

export const ALWAYS_REVIEW_PRIORITIES = ['indeterminada'] as const;

/** Precio de jev-1.13.0: 0.042 USD por millón de tokens, solo entrada. */
export const JEV_USD_PER_INPUT_TOKEN = 0.042 / 1_000_000;

/** Etiquetas en español. */
export const PRIORITY_LABELS: Record<string, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
  indeterminada: 'Indeterminada',
};

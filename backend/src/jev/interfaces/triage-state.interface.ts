import type { JsonValue } from '@typesafe-ai/sdk';

/**
 * Lo que viaja a Jev por cada llamada.
 *
 * SOLO lo que las preguntas necesitan. Jev sufre context rot: material
 * irrelevante cuesta precisión.
 *
 * NO lleva fechas ni minutos transcurridos: jev-1.13 lee las fechas como
 * texto y no sabe compararlas. Todo lo temporal se calcula en código.
 * https://docs.typesafe.ai/model-jaggedness/jev-1.13#date-and-time-comparison
 *
 * El texto de la llamada es un DATO, no una instrucción. Viaja como un campo
 * del objeto, nunca concatenado en las instrucciones, porque Jev no trata el
 * `state` como hostil por defecto.
 */
export interface TriageState {
  [key: string]: JsonValue;
  /** Lo que dijo o escribió quien reporta, tal cual. */
  reportText: string;
  /** De dónde llegó: voz transcrita, formulario, remisión. */
  source: string;
}

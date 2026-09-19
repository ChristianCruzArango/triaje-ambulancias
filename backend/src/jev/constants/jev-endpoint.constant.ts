/**
 * Datos de la llamada HTTP a System One, para poder mostrarla en la interfaz.
 *
 * El SDK `@typesafe-ai/sdk` hace la petición; esto describe lo que envía, para
 * que el panel de inspección pueda explicarlo sin inventar nada.
 */
export const JEV_ENDPOINT = {
  method: 'POST',
  url: 'https://api.typesafe.ai/v1/systemone',
  headers: {
    Authorization: 'Bearer ${TYPESAFE_API_KEY}',
    'Content-Type': 'application/json',
  },
  /** Dónde vive el cuerpo de la petición en el repositorio. */
  questionsSource: 'backend/src/jev/constants/triage-questions.constant.ts',
  clientSource: 'backend/src/jev/jev.service.ts',
  docs: 'https://docs.typesafe.ai/api',
} as const;

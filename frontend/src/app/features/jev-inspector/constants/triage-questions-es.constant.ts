/**
 * Las nueve preguntas, en español, para mostrarlas en pantalla.
 *
 * IMPORTANTE: a Jev viajan **en inglés**, porque es su idioma principal de
 * entrenamiento y ahí acierta más. Medido en este proyecto, un caso ambiguo
 * pasó de 0,73 a 0,96 de confianza al traducirlas.
 * https://docs.typesafe.ai/models#language-support
 *
 * Esta tabla es solo la traducción para el operador. Lo que se envía no cambia.
 */
export interface QuestionLabel {
  /** Clave con la que responde Jev. */
  key: string;
  /** La pregunta, en español. */
  question: string;
  /** Qué devuelve. */
  returns: string;
}

/** La pregunta de tipo `choice`: de aquí sale el hospital. */
export const CAPABILITY_QUESTION: QuestionLabel = {
  key: 'required_capability',
  question: '¿Qué servicio hospitalario necesita este paciente al llegar?',
  returns: 'Una opción de siete, con su probabilidad y confianza',
};

/** Las ocho preguntas `noul`: de aquí sale la prioridad. */
export const FLAG_QUESTIONS: QuestionLabel[] = [
  { key: 'patient_unresponsive', question: '¿El paciente no responde o está inconsciente?', returns: 'Valor de 0 a 1' },
  { key: 'airwayCompromised', question: '¿Tiene la vía aérea o la respiración comprometida?', returns: 'Valor de 0 a 1' },
  { key: 'severeBleeding', question: '¿Está sangrando de forma severa?', returns: 'Valor de 0 a 1' },
  { key: 'strokeSigns', question: '¿Hay signos de ataque cerebrovascular?', returns: 'Valor de 0 a 1' },
  { key: 'cardiacChestPain', question: '¿El dolor de pecho sugiere un infarto?', returns: 'Valor de 0 a 1' },
  { key: 'highEnergyTrauma', question: '¿Fue una lesión por un mecanismo de alta energía?', returns: 'Valor de 0 a 1' },
  { key: 'isChild', question: '¿El paciente es un niño o un bebé?', returns: 'Valor de 0 a 1' },
  { key: 'needsMedicalized', question: '¿Necesita una ambulancia medicalizada, no una básica?', returns: 'Valor de 0 a 1' },
];

/** Mapea la clave interna de las banderas a su pregunta en español. */
export const FLAG_QUESTION_BY_KEY: Record<string, string> = {
  unresponsive: '¿El paciente no responde o está inconsciente?',
  airwayCompromised: '¿Tiene la vía aérea o la respiración comprometida?',
  severeBleeding: '¿Está sangrando de forma severa?',
  strokeSigns: '¿Hay signos de ataque cerebrovascular?',
  cardiacChestPain: '¿El dolor de pecho sugiere un infarto?',
  highEnergyTrauma: '¿Fue una lesión por un mecanismo de alta energía?',
  isChild: '¿El paciente es un niño o un bebé?',
  needsMedicalized: '¿Necesita una ambulancia medicalizada, no una básica?',
};

/** Cómo se lee un valor noul. */
export function readNoul(value: number): string {
  if (value >= 0.8) return 'Sí';
  if (value >= 0.6) return 'Probablemente sí';
  if (value >= 0.4) return 'No está claro';
  if (value >= 0.2) return 'Probablemente no';
  return 'No';
}

/** Umbral a partir del cual la bandera activa una regla del protocolo. */
export const FLAG_RAISED_THRESHOLD = 0.6;

import type { Questions } from '@typesafe-ai/sdk';

/**
 * Las cinco preguntas de triaje. Se envían EN UNA SOLA PETICIÓN: Jev las
 * evalúa en paralelo contra el mismo estado, así que añadir preguntas apenas
 * cambia el tiempo de respuesta.
 *
 * En INGLÉS a propósito: es el idioma principal de entrenamiento de Jev
 * (https://docs.typesafe.ai/models#language-support). Medido en este proyecto,
 * un caso ambiguo subió de 0.73 a 0.96 de confianza al traducir las preguntas.
 * La llamada y la interfaz siguen en español.
 *
 * Ninguna pregunta pide comparar tiempos ni hacer cuentas: jev-1.13 no lo hace
 * de forma fiable y eso se resuelve en código.
 * https://docs.typesafe.ai/model-jaggedness/jev-1.13
 */
export const TRIAGE_QUESTIONS = {
  /**
   * ⚠️ NO se le pregunta a Jev "qué tan urgente es".
   *
   * Se midió: esa pregunta devolvía confianzas de 0.48–0.54 incluso en casos
   * de libro, porque la urgencia pesa varios factores independientes a la vez.
   * La documentación lo dice: si la pregunta requiere ponderar factores
   * independientes, hay que descomponerla y combinar en código.
   * https://docs.typesafe.ai/introduction#atomic-questions-composed-in-code
   *
   * Así que abajo hay BANDERAS ROJAS ATÓMICAS, cada una con una sola cosa que
   * juzgar, y la prioridad la calcula el protocolo en `triage/`.
   */

  /** Qué servicio necesita el hospital de destino. */
  required_capability: {
    type: 'choice',
    instructions:
      'Which specialised hospital service does this patient most likely need on arrival?',
    criteria: {
      urgencias_generales: 'General emergency care is enough',
      unidad_acv:
        'Signs of a stroke: sudden weakness on one side, slurred speech, facial droop, sudden confusion',
      trauma_mayor:
        'Severe physical injury: traffic collision, fall from height, gunshot or stab wound, crush injury',
      hemodinamia:
        'Signs of a heart attack: crushing chest pain, pain radiating to the arm or jaw, with sweating or nausea',
      quemados: 'Significant burns from fire, scalding, chemicals or electricity',
      pediatria: 'The patient is a child or an infant',
      obstetricia: 'Pregnancy, labour, or a complication of pregnancy',
    },
  },

  /** Señal de alarma: no responde. */
  patient_unresponsive: {
    type: 'noul',
    instructions: 'Is the patient unresponsive or unconscious?',
    criteria: {
      true: 'The report says the patient does not respond, is unconscious, fainted, or cannot be woken',
      false: 'The patient is described as awake, talking, or responding',
    },
  },

  /** Señal de alarma: vía aérea o respiración. */
  airway_or_breathing_compromised: {
    type: 'noul',
    instructions: "Is the patient's airway or breathing compromised?",
    criteria: {
      true: 'Choking, not breathing, gasping, struggling to breathe, turning blue, or drowning',
      false: 'Breathing is described as normal, or breathing is not mentioned as a problem',
    },
  },


  /** Bandera roja: sangrado que amenaza la vida. */
  severe_bleeding: {
    type: 'noul',
    instructions: 'Is the patient bleeding severely?',
    criteria: {
      true: 'Heavy, spurting or uncontrolled bleeding, a large blood loss, or a deep open wound',
      false: 'No bleeding is reported, or the bleeding is minor',
    },
  },

  /** Bandera roja: signos de ataque cerebrovascular. */
  stroke_signs: {
    type: 'noul',
    instructions: 'Does the report describe signs of a stroke?',
    criteria: {
      true: 'Sudden weakness or numbness on one side, facial droop, slurred or strange speech, or sudden confusion',
      false: 'None of those signs are described',
    },
  },

  /** Bandera roja: dolor torácico de perfil cardíaco. */
  cardiac_chest_pain: {
    type: 'noul',
    instructions: 'Does the report describe chest pain that suggests a heart attack?',
    criteria: {
      true: 'Crushing or pressing chest pain, pain spreading to the arm, neck or jaw, often with sweating, nausea or shortness of breath',
      false: 'No chest pain, or chest pain that does not fit that description',
    },
  },

  /** Bandera roja: mecanismo de trauma de alta energía. */
  high_energy_trauma: {
    type: 'noul',
    instructions: 'Was the patient injured by a high-energy mechanism?',
    criteria: {
      true: 'Traffic collision, fall from height, gunshot or stab wound, crush injury, or explosion',
      false: 'No injury, or a low-energy injury such as a trip, a sprain or a small cut',
    },
  },

  /** Dato de contexto: paciente pediátrico. */
  patient_is_child: {
    type: 'noul',
    instructions: 'Is the patient a child, an infant or a newborn?',
    criteria: {
      true: 'The report describes a baby, an infant, a child, or gives an age under 15 years',
      false: 'The patient is an adult, or no age suggests a child',
    },
  },

  /** Si hace falta una unidad medicalizada (TAM) y no una básica (TAB). */
  needs_medicalized_unit: {
    type: 'noul',
    instructions:
      'Does this patient need an advanced life support ambulance with a physician on board, rather than a basic transport ambulance?',
    criteria: {
      true: 'The patient is unstable, may need resuscitation, advanced airway management, or drugs during transport',
      false: 'A basic transport unit with a paramedic is enough for this patient',
    },
  },
} as const satisfies Questions;

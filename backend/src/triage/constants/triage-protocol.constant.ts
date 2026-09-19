import type { TriagePriority } from '../interfaces/triage.interface.js';

/**
 * PROTOCOLO DE TRIAJE — DATOS DE DEMOSTRACIÓN
 *
 * ⚠️ Esto NO es un protocolo clínico validado. Está inspirado en la lógica de
 * sistemas como Manchester o START, pero los umbrales y el orden los escribí
 * para la demostración. En un sistema real lo define personal médico y se
 * calibra con casos reales etiquetados.
 *
 * Lo importante del diseño: estas reglas viven en CÓDIGO, no en un prompt.
 * Se pueden leer, versionar, discutir con un médico y cambiar sin tocar el
 * modelo. Jev aporta las banderas; la decisión es de la institución.
 *
 * Se evalúan EN ORDEN y gana la primera que dispare.
 */
export interface ProtocolRule {
  id: string;
  priority: TriagePriority;
  /** Descripción legible que se muestra en la interfaz. */
  rationale: string;
}

export const PROTOCOL_ORDER: ProtocolRule[] = [
  {
    id: 'R1_VIA_AEREA',
    priority: 'critica',
    rationale: 'Vía aérea o respiración comprometida: amenaza inmediata para la vida.',
  },
  {
    id: 'R2_NO_RESPONDE',
    priority: 'critica',
    rationale: 'El paciente no responde: amenaza inmediata para la vida.',
  },
  {
    id: 'R3_DOLOR_CARDIACO',
    priority: 'critica',
    rationale: 'Dolor torácico de perfil cardíaco: existe ventana terapéutica.',
  },
  {
    id: 'R4_ACV',
    priority: 'critica',
    rationale: 'Signos de ataque cerebrovascular: existe ventana terapéutica.',
  },
  {
    id: 'R5_SANGRADO',
    priority: 'alta',
    rationale: 'Sangrado severo reportado.',
  },
  {
    id: 'R6_TRAUMA_ALTA_ENERGIA',
    priority: 'alta',
    rationale: 'Mecanismo de trauma de alta energía.',
  },
  {
    id: 'R7_REQUIERE_ESPECIALIDAD',
    priority: 'alta',
    rationale: 'Requiere un servicio especializado, sin banderas rojas activas.',
  },
  {
    id: 'R8_SIN_BANDERAS',
    priority: 'baja',
    rationale: 'Sin banderas rojas activas y sin requerimiento de especialidad.',
  },
];

/** Etiquetas y colores de prioridad para la interfaz. */
export const PRIORITY_LABELS: Record<TriagePriority, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

export const PRIORITY_COLORS: Record<TriagePriority, string> = {
  critica: '#ef4444',
  alta: '#f97316',
  media: '#eab308',
  baja: '#22c55e',
};

/**
 * Un paciente pediátrico sube un nivel de prioridad.
 * Criterio conservador de demostración: los niños se descompensan más rápido.
 */
export const ESCALATE_IF_CHILD = true;

export const PRIORITY_ESCALATION: Record<TriagePriority, TriagePriority> = {
  baja: 'media',
  media: 'alta',
  alta: 'critica',
  critica: 'critica',
};

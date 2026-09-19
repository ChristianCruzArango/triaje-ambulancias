/** Velocidad media urbana asumida para estimar tiempos, en km/h. */
export const AVERAGE_SPEED_KMH = 35;

/** Prioridades que exigen unidad medicalizada aunque Jev no lo pida. */
export const PRIORITIES_REQUIRING_TAM = ['critica'] as const;

/** Motivos de descarte, en español, para mostrar en la interfaz. */
export const REJECTION_REASONS = {
  noCapability: (capability: string) => `No cuenta con ${capability}`,
  noBeds: 'Sin camas de urgencias disponibles',
  notEligible: 'No elegible',
} as const;

/** De dónde llegó la solicitud de emergencia. */
export const EMERGENCY_SOURCES = {
  voz: 'voz',
  formulario: 'formulario',
  remision: 'remision',
} as const;

/** El que se asume cuando el cliente no lo indica. */
export const DEFAULT_EMERGENCY_SOURCE = EMERGENCY_SOURCES.voz;

export type EmergencySource =
  (typeof EMERGENCY_SOURCES)[keyof typeof EMERGENCY_SOURCES];

/** En qué va la atención de la emergencia. */
export enum EmergencyStatus {
  /** Llegó la llamada, aún sin evaluar. */
  RECIBIDA = 'RECIBIDA',
  /** Jev respondió y el protocolo asignó prioridad. */
  TRIADA = 'TRIADA',
  /** Ambulancia asignada, yendo al sitio. */
  DESPACHADA = 'DESPACHADA',
  /** La ambulancia llegó al incidente. */
  EN_SITIO = 'EN_SITIO',
  /** Paciente a bordo, camino al hospital. */
  TRASLADO = 'TRASLADO',
  /** Paciente entregado. */
  CERRADA = 'CERRADA',
  /** Esperando que una persona la revise. */
  REVISION = 'REVISION',
}

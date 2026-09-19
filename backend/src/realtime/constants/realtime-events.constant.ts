/** Nombres de los eventos de Socket.IO. Espejo del frontend. */
export const REALTIME_EVENTS = {
  /** Entró una llamada. Aún sin evaluar. */
  emergencyReceived: 'emergency.received',
  /** Jev respondió y el protocolo asignó prioridad. */
  emergencyTriaged: 'emergency.triaged',
  /** Se eligió ambulancia y hospital. */
  emergencyDispatched: 'emergency.dispatched',
  /** La flota se movió. */
  fleetUpdated: 'fleet.updated',
} as const;

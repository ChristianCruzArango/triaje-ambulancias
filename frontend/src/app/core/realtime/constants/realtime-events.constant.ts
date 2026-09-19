/**
 * Nombres de los eventos de Socket.IO.
 * Espejo de `backend/src/realtime/constants/realtime-events.constant.ts`.
 */
export const REALTIME_EVENTS = {
  emergencyReceived: 'emergency.received',
  emergencyTriaged: 'emergency.triaged',
  emergencyDispatched: 'emergency.dispatched',
  fleetUpdated: 'fleet.updated',
} as const;

export type RealtimeEventName =
  (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];

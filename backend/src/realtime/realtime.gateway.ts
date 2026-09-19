import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { REALTIME_EVENTS } from './constants/realtime-events.constant.js';
import type {
  EmergencyDispatchedPayload,
  EmergencyReceivedPayload,
  EmergencyTriagedPayload,
  FleetUpdatedPayload,
} from './interfaces/realtime-payloads.interface.js';

/**
 * Difusión en vivo por Socket.IO.
 *
 * Transmite CAMBIOS, no es la fuente de verdad: al reconectar, el frontend
 * recarga el estado completo por HTTP.
 *
 * Los eventos salen POR SEPARADO a propósito. En pantalla se ve la secuencia:
 * entra la llamada → Jev la clasifica → se despacha. Ese escalonado es lo que
 * hace visible dónde interviene cada pieza.
 */
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_ORIGIN },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  emitEmergencyReceived(payload: EmergencyReceivedPayload) {
    this.server?.emit(REALTIME_EVENTS.emergencyReceived, payload);
  }

  emitTriaged(payload: EmergencyTriagedPayload) {
    this.server?.emit(REALTIME_EVENTS.emergencyTriaged, payload);
  }

  emitDispatched(payload: EmergencyDispatchedPayload) {
    this.server?.emit(REALTIME_EVENTS.emergencyDispatched, payload);
  }

  emitFleetUpdated(payload: FleetUpdatedPayload) {
    this.server?.emit(REALTIME_EVENTS.fleetUpdated, payload);
  }
}

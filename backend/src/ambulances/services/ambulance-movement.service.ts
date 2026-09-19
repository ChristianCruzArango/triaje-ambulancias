import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Emergency } from '../../emergencies/entities/index.js';
import { EmergencyStatus } from '../../emergencies/interfaces/emergency-status.enum.js';
import { HospitalsService } from '../../hospitals/hospitals.service.js';
import { GeoService } from '../../hospitals/services/geo.service.js';
import { RealtimeGateway } from '../../realtime/realtime.gateway.js';
import { AmbulancesService } from '../ambulances.service.js';
import {
  ARRIVAL_THRESHOLD_KM,
  MIN_STEP_DEGREES,
  STEP_FRACTION,
} from '../constants/movement.constant.js';

/**
 * Mueve las ambulancias por el mapa, un paso por tick.
 *
 * Cada unidad avanza una fracción del camino hacia su objetivo actual:
 * primero el incidente, después el hospital. Al llegar cambia de estado y la
 * emergencia avanza con ella.
 *
 * Es interpolación en línea recta, no ruta por calles: para calles haría falta
 * la Directions API de Google, que se factura por petición.
 */
@Injectable()
export class AmbulanceMovementService {
  constructor(
    @InjectRepository(Emergency) private readonly emergencies: Repository<Emergency>,
    private readonly ambulances: AmbulancesService,
    private readonly hospitals: HospitalsService,
    private readonly geo: GeoService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async tick(): Promise<void> {
    const busy = this.ambulances
      .findAll()
      .filter((a) => a.status !== 'disponible' && a.emergencyId);

    if (!busy.length) return;

    const emergencies = await this.emergencies.find({
      where: { id: In(busy.map((a) => a.emergencyId as string)) },
    });
    const byId = new Map(emergencies.map((e) => [e.id, e]));
    let changed = false;

    for (const ambulance of busy) {
      const emergency = byId.get(ambulance.emergencyId as string);
      if (!emergency) continue;

      // ¿Hacia dónde va ahora?
      const target =
        ambulance.status === 'en_camino'
          ? { latitude: emergency.latitude, longitude: emergency.longitude }
          : this.hospitalPoint(ambulance.hospitalCode);

      if (!target) continue;

      const distance = this.geo.distanceKm(ambulance, target);

      if (distance <= ARRIVAL_THRESHOLD_KM) {
        // Aterriza EXACTAMENTE sobre el punto antes de cambiar de estado.
        // Sin esto se quedaba hasta 250 m corta y ahí se congelaba, porque al
        // liberarla ya no tenía objetivo hacia el que seguir avanzando.
        this.ambulances.update(ambulance.id, {
          latitude: target.latitude,
          longitude: target.longitude,
        });
        await this.onArrival(ambulance.id, emergency);
        changed = true;
        continue;
      }

      // Un paso hacia el objetivo.
      this.ambulances.update(ambulance.id, {
        latitude: this.step(ambulance.latitude, target.latitude),
        longitude: this.step(ambulance.longitude, target.longitude),
      });
      changed = true;
    }

    if (changed) {
      this.realtime.emitFleetUpdated({ ambulances: this.ambulances.findAll() });
    }
  }

  /**
   * Un paso hacia el objetivo. Avanza una fracción del camino restante, con
   * un mínimo para que no se arrastre en los últimos metros.
   */
  private step(from: number, to: number): number {
    const remaining = to - from;
    const byFraction = remaining * STEP_FRACTION;
    const minimum = Math.sign(remaining) * MIN_STEP_DEGREES;
    const delta =
      Math.abs(byFraction) < Math.abs(minimum) && Math.abs(remaining) > Math.abs(minimum)
        ? minimum
        : byFraction;
    return Number((from + delta).toFixed(5));
  }

  /** Llegó a su objetivo: avanza el estado de la unidad y de la emergencia. */
  private async onArrival(ambulanceId: string, emergency: Emergency): Promise<void> {
    const ambulance = this.ambulances.findById(ambulanceId);
    if (!ambulance) return;

    if (ambulance.status === 'en_camino') {
      this.ambulances.setStatus(ambulanceId, 'trasladando');
      emergency.status = EmergencyStatus.TRASLADO;
      await this.emergencies.save(emergency);
      return;
    }

    if (ambulance.status === 'trasladando') {
      emergency.status = EmergencyStatus.CERRADA;
      await this.emergencies.save(emergency);
      this.ambulances.release(ambulanceId);
    }
  }

  private hospitalPoint(code: string | null) {
    if (!code) return null;
    const hospital = this.hospitals.findByCode(code);
    return hospital
      ? { latitude: hospital.latitude, longitude: hospital.longitude }
      : null;
  }
}

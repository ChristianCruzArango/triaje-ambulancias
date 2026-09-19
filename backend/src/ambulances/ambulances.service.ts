import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RandomService } from '../simulator/services/random.service.js';
import {
  CALI_BOUNDS,
  FLEET_SIZE,
  MEDICALIZED_RATIO,
} from './constants/fleet.constant.js';
import type {
  Ambulance,
  AmbulanceStatus,
} from './interfaces/ambulance.interface.js';

/**
 * Flota de ambulancias.
 *
 * Vive en memoria a propósito: es estado operativo volátil de la
 * demostración, no un registro histórico. Lo que sí se persiste es la
 * emergencia y a qué ambulancia se asignó.
 *
 * Al arrancar, las unidades se reparten AL AZAR dentro de la caja geográfica
 * de Cali, para que cada demostración empiece distinta.
 */
@Injectable()
export class AmbulancesService implements OnModuleInit {
  private readonly logger = new Logger(AmbulancesService.name);
  private readonly fleet = new Map<string, Ambulance>();

  constructor(private readonly random: RandomService) {}

  onModuleInit() {
    this.deployFleet();
  }

  /** Reparte la flota al azar por Cali. */
  deployFleet(): void {
    this.fleet.clear();

    for (let i = 0; i < FLEET_SIZE; i++) {
      const id = `amb-${i + 1}`;
      const medicalized = i < Math.round(FLEET_SIZE * MEDICALIZED_RATIO);

      this.fleet.set(id, {
        id,
        code: `${medicalized ? 'TAM' : 'TAB'}-${String(i + 1).padStart(2, '0')}`,
        type: medicalized ? 'TAM' : 'TAB',
        status: 'disponible',
        latitude: this.randomBetween(CALI_BOUNDS.minLat, CALI_BOUNDS.maxLat),
        longitude: this.randomBetween(CALI_BOUNDS.minLng, CALI_BOUNDS.maxLng),
        emergencyId: null,
        hospitalCode: null,
      });
    }

    this.logger.log(`Flota desplegada: ${FLEET_SIZE} ambulancias por Cali.`);
  }

  findAll(): Ambulance[] {
    return [...this.fleet.values()];
  }

  findById(id: string): Ambulance | undefined {
    return this.fleet.get(id);
  }

  findAvailable(): Ambulance[] {
    return this.findAll().filter((a) => a.status === 'disponible');
  }

  /** Cambia estado y posición de una unidad. */
  update(id: string, patch: Partial<Ambulance>): Ambulance | undefined {
    const ambulance = this.fleet.get(id);
    if (!ambulance) return undefined;
    Object.assign(ambulance, patch);
    return ambulance;
  }

  setStatus(id: string, status: AmbulanceStatus): Ambulance | undefined {
    return this.update(id, { status });
  }

  /** Libera la unidad: vuelve a quedar disponible donde esté. */
  release(id: string): Ambulance | undefined {
    return this.update(id, {
      status: 'disponible',
      emergencyId: null,
      hospitalCode: null,
    });
  }

  private randomBetween(min: number, max: number): number {
    return Number((min + this.random.next() * (max - min)).toFixed(5));
  }
}

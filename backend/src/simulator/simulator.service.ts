import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Emergency } from '../emergencies/entities/index.js';
import { EmergencyStatus } from '../emergencies/interfaces/emergency-status.enum.js';
import { EmergencyPipeline } from '../emergencies/services/emergency-pipeline.service.js';
import { CALI_ADDRESSES } from './constants/cali-addresses.constant.js';
import {
  CALL_SCRIPTS,
  MAX_ACTIVE_EMERGENCIES,
} from './constants/call-scripts.constant.js';
import type { SimulatorState } from './interfaces/simulator-state.interface.js';
import { RandomService } from './services/random.service.js';

/**
 * Genera llamadas de emergencia de demostración.
 *
 * Cada llamada combina un GUION ficticio con una DIRECCIÓN REAL de Cali
 * elegida al azar. Así cada caso llega desde un punto distinto de la ciudad y
 * el despacho tiene que elegir de verdad entre hospitales.
 *
 * Los guiones no contienen nombres, teléfonos ni datos personales reales.
 */
@Injectable()
export class SimulatorService {
  private readonly logger = new Logger(SimulatorService.name);
  private paused = false;

  constructor(
    @InjectRepository(Emergency) private readonly emergencies: Repository<Emergency>,
    private readonly pipeline: EmergencyPipeline,
    private readonly random: RandomService,
    private readonly config: ConfigService,
  ) {}

  /** Dispara una llamada nueva desde una dirección aleatoria de Cali. */
  async generateCall(): Promise<Emergency | null> {
    const active = await this.emergencies.count({
      where: { status: Not(EmergencyStatus.CERRADA) },
    });
    if (active >= MAX_ACTIVE_EMERGENCIES) {
      this.logger.debug('Tope de emergencias activas alcanzado.');
      return null;
    }

    const script = this.random.pick(CALL_SCRIPTS);
    const address = this.random.pick(CALI_ADDRESSES);

    return this.pipeline.intake({
      reportText: script.text,
      source: 'voz',
      addressLabel: address.label,
      latitude: address.latitude,
      longitude: address.longitude,
    });
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  get isPaused(): boolean { return this.paused; }

  getState(): SimulatorState {
    return {
      enabled: this.config.getOrThrow<boolean>('simulator.enabled'),
      paused: this.paused,
      createSeconds: this.config.getOrThrow<number>('simulator.createSeconds'),
      advanceSeconds: this.config.getOrThrow<number>('simulator.advanceSeconds'),
      seeded: this.random.seeded,
    };
  }
}

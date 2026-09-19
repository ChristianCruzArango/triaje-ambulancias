import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AmbulanceMovementService } from '../ambulances/services/ambulance-movement.service.js';
import { SimulatorService } from './simulator.service.js';

/**
 * Dos trabajos INDEPENDIENTES, y esa independencia importa:
 *
 *  - **Movimiento de la flota**: corre SIEMPRE. Las ambulancias despachadas
 *    tienen que llegar a su destino, las haya pedido un cron o una persona.
 *  - **Generación de llamadas**: solo si `SIMULATOR_ENABLED` es `true`. Con
 *    `false`, las llamadas entran únicamente cuando alguien pulsa el botón.
 *
 * Si se despliega más de una instancia haría falta un lock distribuido, o
 * correr el scheduler en una sola.
 */
@Injectable()
export class SimulatorScheduler implements OnModuleInit {
  private readonly logger = new Logger(SimulatorScheduler.name);

  constructor(
    private readonly simulator: SimulatorService,
    private readonly movement: AmbulanceMovementService,
    private readonly config: ConfigService,
    private readonly registry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.startFleetMovement();
    this.startCallGeneration();
  }

  /** Siempre activo: una ambulancia despachada debe llegar. */
  private startFleetMovement(): void {
    const seconds = this.config.getOrThrow<number>('simulator.advanceSeconds');

    const interval = setInterval(() => {
      void this.movement
        .tick()
        .catch((e) => this.logger.error(`Movimiento falló: ${e?.message ?? e}`));
    }, seconds * 1000);

    this.registry.addInterval('fleet:movement', interval);
    this.logger.log(`Flota en movimiento cada ${seconds} s.`);
  }

  /** Opcional: llamadas automáticas para una demostración desatendida. */
  private startCallGeneration(): void {
    if (!this.config.getOrThrow<boolean>('simulator.enabled')) {
      this.logger.log(
        'Llamadas automáticas apagadas: solo entran las que se generen a mano.',
      );
      return;
    }

    const seconds = this.config.getOrThrow<number>('simulator.createSeconds');

    const interval = setInterval(() => {
      if (this.simulator.isPaused) return;
      void this.simulator
        .generateCall()
        .catch((e) => this.logger.error(`Llamada falló: ${e?.message ?? e}`));
    }, seconds * 1000);

    this.registry.addInterval('simulator:calls', interval);
    this.logger.log(`Llamadas automáticas cada ${seconds} s.`);
  }
}

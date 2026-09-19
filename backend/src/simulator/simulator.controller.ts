import { Controller, Get, Post } from '@nestjs/common';
import { EmergencyMapper } from '../emergencies/services/emergency-mapper.service.js';
import { CALI_ADDRESSES } from './constants/cali-addresses.constant.js';
import { SimulatorService } from './simulator.service.js';

@Controller('simulator')
export class SimulatorController {
  constructor(
    private readonly simulator: SimulatorService,
    private readonly mapper: EmergencyMapper,
  ) {}

  /** Direcciones donde puede ocurrir un incidente. Las usa el formulario de voz. */
  @Get('addresses')
  addresses() {
    return CALI_ADDRESSES;
  }

  @Get('state')
  state() {
    return this.simulator.getState();
  }

  /** El botón "Generar llamada" del frontend. */
  @Post('call')
  async generateCall() {
    const emergency = await this.simulator.generateCall();
    return emergency ? this.mapper.toDto(emergency, null) : { created: false };
  }

  @Post('pause')
  pause() {
    this.simulator.pause();
    return this.simulator.getState();
  }

  @Post('resume')
  resume() {
    this.simulator.resume();
    return this.simulator.getState();
  }
}

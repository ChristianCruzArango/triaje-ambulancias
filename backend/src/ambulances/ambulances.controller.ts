import { Controller, Get, Post } from '@nestjs/common';
import { AmbulancesService } from './ambulances.service.js';

@Controller('ambulances')
export class AmbulancesController {
  constructor(private readonly ambulances: AmbulancesService) {}

  @Get()
  findAll() {
    return this.ambulances.findAll();
  }

  /** Vuelve a repartir la flota al azar. Útil para reiniciar la demostración. */
  @Post('redeploy')
  redeploy() {
    this.ambulances.deployFleet();
    return this.ambulances.findAll();
  }
}

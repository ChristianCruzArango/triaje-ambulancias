import { Controller, Get } from '@nestjs/common';
import { HospitalsService } from './hospitals.service.js';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitals: HospitalsService) {}

  @Get()
  findAll() {
    return this.hospitals.findAll();
  }
}

import { Module } from '@nestjs/common';
import { HospitalsController } from './hospitals.controller.js';
import { HospitalsService } from './hospitals.service.js';
import { GeoService } from './services/geo.service.js';

@Module({
  controllers: [HospitalsController],
  providers: [HospitalsService, GeoService],
  exports: [HospitalsService, GeoService],
})
export class HospitalsModule {}

import { Module } from '@nestjs/common';
import { AmbulancesModule } from '../ambulances/ambulances.module.js';
import { HospitalsModule } from '../hospitals/hospitals.module.js';
import { DispatchService } from './dispatch.service.js';

@Module({
  imports: [AmbulancesModule, HospitalsModule],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}

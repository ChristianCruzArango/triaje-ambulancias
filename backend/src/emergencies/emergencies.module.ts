import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmbulancesModule } from '../ambulances/ambulances.module.js';
import { DispatchModule } from '../dispatch/dispatch.module.js';
import { HospitalsModule } from '../hospitals/hospitals.module.js';
import { JevModule } from '../jev/jev.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';
import { TriageModule } from '../triage/triage.module.js';
import { EmergenciesController } from './emergencies.controller.js';
import { EmergenciesService } from './emergencies.service.js';
import { Emergency, TriageAssessment } from './entities/index.js';
import { EmergencyMapper } from './services/emergency-mapper.service.js';
import { EmergencyPipeline } from './services/emergency-pipeline.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Emergency, TriageAssessment]),
    JevModule,
    TriageModule,
    DispatchModule,
    AmbulancesModule,
    HospitalsModule,
    RealtimeModule,
  ],
  controllers: [EmergenciesController],
  providers: [EmergenciesService, EmergencyPipeline, EmergencyMapper],
  exports: [EmergenciesService, EmergencyPipeline, EmergencyMapper, TypeOrmModule],
})
export class EmergenciesModule {}

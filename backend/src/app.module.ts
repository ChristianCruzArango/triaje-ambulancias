import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AmbulancesModule } from './ambulances/ambulances.module.js';
import { AppConfigModule } from './config/config.module.js';
import { DispatchModule } from './dispatch/dispatch.module.js';
import { EmergenciesModule } from './emergencies/emergencies.module.js';
import { HealthModule } from './health/health.module.js';
import { HospitalsModule } from './hospitals/hospitals.module.js';
import { JevModule } from './jev/jev.module.js';
import { PersistenceModule } from './persistence/persistence.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
import { SimulatorModule } from './simulator/simulator.module.js';
import { StatsModule } from './stats/stats.module.js';
import { TriageModule } from './triage/triage.module.js';

@Module({
  imports: [
    AppConfigModule,
    PersistenceModule,
    ScheduleModule.forRoot(),
    HealthModule,
    HospitalsModule,
    AmbulancesModule,
    JevModule,
    TriageModule,
    DispatchModule,
    EmergenciesModule,
    RealtimeModule,
    SimulatorModule,
    StatsModule,
  ],
})
export class AppModule {}

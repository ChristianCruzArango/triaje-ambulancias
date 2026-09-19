import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emergency } from '../emergencies/entities/index.js';
import { HospitalsModule } from '../hospitals/hospitals.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';
import { RandomService } from '../simulator/services/random.service.js';
import { AmbulancesController } from './ambulances.controller.js';
import { AmbulancesService } from './ambulances.service.js';
import { AmbulanceMovementService } from './services/ambulance-movement.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Emergency]),
    HospitalsModule,
    RealtimeModule,
  ],
  controllers: [AmbulancesController],
  providers: [AmbulancesService, AmbulanceMovementService, RandomService],
  exports: [AmbulancesService, AmbulanceMovementService],
})
export class AmbulancesModule {}

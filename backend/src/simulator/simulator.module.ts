import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmbulancesModule } from '../ambulances/ambulances.module.js';
import { EmergenciesModule } from '../emergencies/emergencies.module.js';
import { Emergency } from '../emergencies/entities/index.js';
import { SimulatorController } from './simulator.controller.js';
import { SimulatorScheduler } from './simulator.scheduler.js';
import { SimulatorService } from './simulator.service.js';
import { RandomService } from './services/random.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Emergency]), EmergenciesModule, AmbulancesModule],
  controllers: [SimulatorController],
  providers: [SimulatorService, SimulatorScheduler, RandomService],
  exports: [SimulatorService],
})
export class SimulatorModule {}

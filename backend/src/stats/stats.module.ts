import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emergency, TriageAssessment } from '../emergencies/entities/index.js';
import { StatsController } from './stats.controller.js';
import { StatsService } from './stats.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Emergency, TriageAssessment])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}

import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service.js';

@Controller('stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  /** Totales de uso de IA para la barra superior. */
  @Get('ai')
  ai() {
    return this.stats.getAiStats();
  }
}

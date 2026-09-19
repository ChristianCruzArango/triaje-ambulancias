import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { DEFAULT_EMERGENCY_SOURCE } from './constants/emergency-source.constant.js';
import { CreateEmergencyDto } from './dto/create-emergency.dto.js';
import { EmergenciesService } from './emergencies.service.js';
import { EmergencyPipeline } from './services/emergency-pipeline.service.js';
import { EmergencyMapper } from './services/emergency-mapper.service.js';

@Controller('emergencies')
export class EmergenciesController {
  constructor(
    private readonly emergencies: EmergenciesService,
    private readonly pipeline: EmergencyPipeline,
    private readonly mapper: EmergencyMapper,
  ) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.emergencies.findAll(limit ? Number(limit) : 60);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencies.findOne(id);
  }

  /** Alta manual de una llamada: es lo que usa el micrófono del frontend. */
  @Post()
  async create(@Body() dto: CreateEmergencyDto) {
    const emergency = await this.pipeline.intake({
      reportText: dto.reportText,
      source: dto.source ?? DEFAULT_EMERGENCY_SOURCE,
      addressLabel: dto.addressLabel,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
    return this.mapper.toDto(emergency, null);
  }
}

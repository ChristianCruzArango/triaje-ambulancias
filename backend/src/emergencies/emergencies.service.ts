import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emergency } from './entities/index.js';
import type { EmergencyDto } from './interfaces/emergency-dto.interface.js';
import { EmergencyMapper } from './services/emergency-mapper.service.js';

@Injectable()
export class EmergenciesService {
  constructor(
    @InjectRepository(Emergency) private readonly emergencies: Repository<Emergency>,
    private readonly mapper: EmergencyMapper,
  ) {}

  async findAll(limit = 60): Promise<EmergencyDto[]> {
    const rows = await this.emergencies.find({
      relations: { assessment: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return rows.map((e) => this.mapper.toDto(e, e.assessment ?? null));
  }

  async findOne(id: string): Promise<EmergencyDto> {
    const emergency = await this.emergencies.findOne({
      where: { id },
      relations: { assessment: true },
    });
    if (!emergency) throw new NotFoundException(`Emergencia ${id} no encontrada`);
    return this.mapper.toDto(emergency, emergency.assessment ?? null);
  }
}

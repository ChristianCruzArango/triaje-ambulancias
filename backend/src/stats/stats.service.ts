import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emergency, TriageAssessment } from '../emergencies/entities/index.js';
import type { AiStatsDto } from '../emergencies/interfaces/emergency-dto.interface.js';

/** Totales acumulados. Se calculan sobre lo persistido. */
@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(TriageAssessment)
    private readonly assessments: Repository<TriageAssessment>,
    @InjectRepository(Emergency)
    private readonly emergencies: Repository<Emergency>,
  ) {}

  async getAiStats(): Promise<AiStatsDto> {
    const jev = await this.assessments
      .createQueryBuilder('a')
      .select('COUNT(*)', 'calls')
      .addSelect('COALESCE(SUM(a.cost_usd), 0)', 'cost')
      .addSelect('COALESCE(AVG(a.latency_ms), 0)', 'latency')
      .addSelect('COALESCE(SUM(a.input_tokens), 0)', 'tokens')
      .getRawOne<{ calls: string; cost: string; latency: string; tokens: string }>();

    const dispatch = await this.emergencies
      .createQueryBuilder('e')
      .select('COUNT(*)', 'total')
      .addSelect('COUNT(*) FILTER (WHERE e.nearest_overruled IS NOT NULL)', 'overruled')
      .addSelect(`COUNT(*) FILTER (WHERE e.status = 'REVISION')`, 'review')
      .addSelect('COALESCE(AVG(e.dispatch_latency_ms), 0)', 'latency')
      .getRawOne<{ total: string; overruled: string; review: string; latency: string }>();

    return {
      jev: {
        calls: Number(jev?.calls ?? 0),
        totalCostUsd: Number(jev?.cost ?? 0),
        avgLatencyMs: Math.round(Number(jev?.latency ?? 0)),
        totalInputTokens: Number(jev?.tokens ?? 0),
      },
      dispatch: {
        total: Number(dispatch?.total ?? 0),
        overruledNearest: Number(dispatch?.overruled ?? 0),
        humanReview: Number(dispatch?.review ?? 0),
        avgLatencyMs: Math.round(Number(dispatch?.latency ?? 0)),
      },
    };
  }
}

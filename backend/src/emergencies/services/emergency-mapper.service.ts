import { Injectable } from '@nestjs/common';
import type { HospitalCandidate } from '../../dispatch/interfaces/dispatch.interface.js';
import { CAPABILITY_LABELS } from '../../hospitals/constants/cali-hospitals.constant.js';
import { JEV_ENDPOINT } from '../../jev/constants/jev-endpoint.constant.js';
import { HospitalsService } from '../../hospitals/hospitals.service.js';
import { Emergency, TriageAssessment } from '../entities/index.js';
import type {
  AssessmentDto,
  EmergencyDto,
} from '../interfaces/emergency-dto.interface.js';

/** Convierte entidades en la forma que consume Angular. */
@Injectable()
export class EmergencyMapper {
  constructor(private readonly hospitals: HospitalsService) {}

  toAssessmentDto(a: TriageAssessment): AssessmentDto {
    return {
      model: a.model,
      requiredCapability: a.requiredCapability,
      requiredCapabilityLabel:
        CAPABILITY_LABELS[a.requiredCapability] ?? a.requiredCapability,
      capabilityProbabilities: a.capabilityProbabilities,
      capabilityConfidence: a.capabilityConfidence,
      flags: a.flags,
      sentState: a.sentState,
      sentQuestions: a.sentQuestions,
      rawResponse: a.rawResponse,
      endpoint: JEV_ENDPOINT,
      latencyMs: a.latencyMs,
      inputTokens: a.inputTokens,
      outputTokens: a.outputTokens,
      costUsd: a.costUsd,
      error: a.error,
      createdAt: a.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  }

  toDto(e: Emergency, assessment: TriageAssessment | null): EmergencyDto {
    return {
      id: e.id,
      callCode: e.callCode,
      reportText: e.reportText,
      source: e.source,
      addressLabel: e.addressLabel,
      latitude: Number(e.latitude),
      longitude: Number(e.longitude),
      status: e.status,
      priority: e.priority,
      ruleFired: e.ruleFired,
      rationale: e.rationale,
      ambulanceCode: e.ambulanceCode,
      hospitalCode: e.hospitalCode,
      hospitalName: e.hospitalCode ? this.hospitals.nameOf(e.hospitalCode) : null,
      hospitalDistanceKm: e.hospitalDistanceKm,
      nearestOverruled: e.nearestOverruled as EmergencyDto['nearestOverruled'],
      hospitalCandidates: e.hospitalCandidates as HospitalCandidate[] | null,
      dispatchLatencyMs: e.dispatchLatencyMs,
      blockedReason: e.blockedReason,
      isDemo: e.isDemo,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      assessment: assessment
        ? this.toAssessmentDto(assessment)
        : (e.assessment ? this.toAssessmentDto(e.assessment) : null),
    };
  }
}

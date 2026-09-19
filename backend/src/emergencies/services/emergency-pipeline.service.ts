import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmbulancesService } from '../../ambulances/ambulances.service.js';
import { DispatchService } from '../../dispatch/dispatch.service.js';
import { JevService } from '../../jev/jev.service.js';
import { RealtimeGateway } from '../../realtime/realtime.gateway.js';
import { TriageProtocolService } from '../../triage/services/triage-protocol.service.js';
import type { TriagePriority } from '../../triage/interfaces/triage.interface.js';
import { Emergency, TriageAssessment } from '../entities/index.js';
import { EmergencyStatus } from '../interfaces/emergency-status.enum.js';
import { EmergencyMapper } from './emergency-mapper.service.js';

/**
 * La cadena completa, en orden:
 *
 *   1. PERSISTIR la llamada y emitirla.      ← existe aunque todo lo demás falle
 *   2. JEV clasifica.                        ← ~300 ms, ~$0.000045
 *   3. PROTOCOLO calcula la prioridad.       ← código, microsegundos
 *   4. DESPACHO elige ambulancia y hospital. ← aritmética, microsegundos
 *   5. Emitir cada paso por separado.        ← para que se vea llegar
 *
 * El orden importa: la llamada se guarda ANTES de tocar la IA. Si Jev se cae,
 * la emergencia sigue existiendo y queda en revisión humana, que es
 * exactamente lo que debe pasar.
 */
@Injectable()
export class EmergencyPipeline {
  private readonly logger = new Logger(EmergencyPipeline.name);

  constructor(
    @InjectRepository(Emergency) private readonly emergencies: Repository<Emergency>,
    @InjectRepository(TriageAssessment) private readonly assessments: Repository<TriageAssessment>,
    private readonly jev: JevService,
    private readonly protocol: TriageProtocolService,
    private readonly dispatch: DispatchService,
    private readonly ambulances: AmbulancesService,
    private readonly realtime: RealtimeGateway,
    private readonly mapper: EmergencyMapper,
  ) {}

  /** Registra una llamada nueva y arranca la cadena. */
  async intake(input: {
    reportText: string;
    source: string;
    addressLabel: string;
    latitude: number;
    longitude: number;
  }): Promise<Emergency> {
    // ── 1. Persistir y emitir. Nada de IA todavía. ──
    const emergency = await this.emergencies.save(
      this.emergencies.create({
        callCode: this.nextCallCode(),
        reportText: input.reportText,
        source: input.source,
        addressLabel: input.addressLabel,
        latitude: input.latitude,
        longitude: input.longitude,
        status: EmergencyStatus.RECIBIDA,
        isDemo: true,
      }),
    );

    this.realtime.emitEmergencyReceived({
      emergency: this.mapper.toDto(emergency, null),
    });

    void this.triageAndDispatch(emergency);
    return emergency;
  }

  private async triageAndDispatch(emergency: Emergency): Promise<void> {
    try {
      // ── 2. Jev ──
      const result = await this.jev.assess({
        reportText: emergency.reportText,
        source: emergency.source,
      });

      const assessment = await this.assessments.save(
        this.assessments.create({
          emergencyId: emergency.id,
          model: result.model,
          requiredCapability: result.requiredCapability,
          capabilityProbabilities: result.capabilityProbabilities,
          capabilityConfidence: result.capabilityConfidence,
          flags: result.flags as unknown as Record<string, number>,
          sentState: result.sentState,
          sentQuestions: result.sentQuestions,
          rawResponse: result.rawResponse,
          latencyMs: result.latencyMs,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          costUsd: result.costUsd,
          error: result.error,
        }),
      );

      // ── 3. Protocolo (código) ──
      const outcome = this.protocol.apply({
        flags: result.flags,
        requiredCapability: result.requiredCapability,
        capabilityConfidence: result.capabilityConfidence,
      });

      emergency.priority = outcome.priority;
      emergency.ruleFired = outcome.ruleFired;
      emergency.rationale = outcome.rationale;
      emergency.status =
        outcome.decision === 'revision_humana'
          ? EmergencyStatus.REVISION
          : EmergencyStatus.TRIADA;

      await this.emergencies.save(emergency);

      this.realtime.emitTriaged({
        emergencyId: emergency.id,
        emergency: this.mapper.toDto(emergency, assessment),
        assessment: this.mapper.toAssessmentDto(assessment),
      });

      // Revisión humana: no se despacha solo. Fin de la cadena automática.
      if (outcome.decision === 'revision_humana') {
        this.logger.log(`${emergency.callCode} → revisión humana`);
        return;
      }

      // ── 4. Despacho (aritmética) ──
      const dispatch = this.dispatch.dispatch({
        incidentLat: emergency.latitude,
        incidentLng: emergency.longitude,
        requiredCapability: result.requiredCapability,
        priority: outcome.priority as TriagePriority,
        requiresMedicalizedUnit: outcome.requiresMedicalizedUnit,
      });

      emergency.ambulanceCode = dispatch.ambulanceCode;
      emergency.hospitalCode = dispatch.hospitalCode;
      emergency.hospitalDistanceKm = dispatch.hospitalDistanceKm;
      emergency.nearestOverruled = dispatch.nearestOverruled;
      emergency.hospitalCandidates = dispatch.candidates;
      emergency.dispatchLatencyMs = dispatch.latencyMs;
      emergency.blockedReason = dispatch.blockedReason;
      emergency.status = dispatch.ambulanceId
        ? EmergencyStatus.DESPACHADA
        : EmergencyStatus.REVISION;

      await this.emergencies.save(emergency);

      // La ambulancia queda ocupada y sale hacia el incidente.
      if (dispatch.ambulanceId) {
        this.ambulances.update(dispatch.ambulanceId, {
          status: 'en_camino',
          emergencyId: emergency.id,
          hospitalCode: dispatch.hospitalCode,
        });
      }

      this.realtime.emitDispatched({
        emergencyId: emergency.id,
        emergency: this.mapper.toDto(emergency, assessment),
        dispatch,
        ambulances: this.ambulances.findAll(),
      });

      this.logger.log(
        `${emergency.callCode} → ${outcome.priority} → ${dispatch.ambulanceCode} → ${dispatch.hospitalName}` +
          (dispatch.nearestOverruled ? ` (se descartó ${dispatch.nearestOverruled.name})` : ''),
      );
    } catch (error) {
      this.logger.error(
        `Cadena de ${emergency.callCode} falló: ${error instanceof Error ? error.message : error}`,
      );
      emergency.status = EmergencyStatus.REVISION;
      await this.emergencies.save(emergency);
    }
  }

  private nextCallCode(): string {
    const now = new Date();
    const stamp = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    return `CALI-${stamp}-${String(Date.now() % 1000).padStart(3, '0')}`;
  }
}

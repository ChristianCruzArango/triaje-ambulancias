import { Injectable, Logger } from '@nestjs/common';
import { TypeSafeClient } from '@typesafe-ai/sdk';
import { TRIAGE_QUESTIONS } from './constants/triage-questions.constant.js';
import { JEV_USD_PER_INPUT_TOKEN } from './constants/triage-thresholds.constant.js';
import type {
  RequiredCapability,
  TriageAssessmentResult,
} from './interfaces/triage-assessment.interface.js';
import type { TriageState } from './interfaces/triage-state.interface.js';

/**
 * Cliente de TypeSafe System One para triaje.
 *
 * Jev responde NUEVE preguntas atómicas en una sola petición y devuelve
 * números. No decide la prioridad, no elige el hospital y no escribe texto.
 *
 * La prioridad la calcula `triage/`, el hospital lo elige `dispatch/`.
 */
@Injectable()
export class JevService {
  private readonly logger = new Logger(JevService.name);
  private readonly client = new TypeSafeClient();

  /**
   * Evalúa una llamada. Nunca lanza: si Jev falla devuelve un resultado con
   * `error`, sin banderas y sin confianza, lo que fuerza revisión humana.
   */
  async assess(state: TriageState): Promise<TriageAssessmentResult> {
    const startedAt = Date.now();

    try {
      const result = await this.client.systemOne({
        state,
        questions: TRIAGE_QUESTIONS,
      });
      const latencyMs = Date.now() - startedAt;
      const a = result.answers;
      const inputTokens = result.usage?.input_tokens ?? null;

      return {
        model: result.model,
        requiredCapability: a.required_capability.choice as RequiredCapability,
        capabilityProbabilities: a.required_capability.probabilities as Record<string, number>,
        capabilityConfidence: a.required_capability.confidence ?? null,
        flags: {
          unresponsive: a.patient_unresponsive.noul,
          airwayCompromised: a.airway_or_breathing_compromised.noul,
          severeBleeding: a.severe_bleeding.noul,
          strokeSigns: a.stroke_signs.noul,
          cardiacChestPain: a.cardiac_chest_pain.noul,
          highEnergyTrauma: a.high_energy_trauma.noul,
          isChild: a.patient_is_child.noul,
          needsMedicalized: a.needs_medicalized_unit.noul,
        },
        sentState: state,
        sentQuestions: TRIAGE_QUESTIONS,
        rawResponse: result,
        latencyMs,
        inputTokens,
        outputTokens: result.usage?.output_tokens ?? null,
        // Jev cobra solo tokens de entrada.
        costUsd: inputTokens === null ? null : inputTokens * JEV_USD_PER_INPUT_TOKEN,
        error: null,
      };
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Jev no disponible (${latencyMs} ms): ${message}`);

      // Sin banderas y sin confianza → el protocolo manda a revisión humana.
      return {
        model: 'unavailable',
        requiredCapability: 'urgencias_generales',
        capabilityProbabilities: null,
        capabilityConfidence: null,
        flags: {
          unresponsive: 0, airwayCompromised: 0, severeBleeding: 0,
          strokeSigns: 0, cardiacChestPain: 0, highEnergyTrauma: 0,
          isChild: 0, needsMedicalized: 0,
        },
        sentState: state,
        sentQuestions: TRIAGE_QUESTIONS,
        rawResponse: null,
        latencyMs,
        inputTokens: null,
        outputTokens: null,
        costUsd: null,
        error: message,
      };
    }
  }
}

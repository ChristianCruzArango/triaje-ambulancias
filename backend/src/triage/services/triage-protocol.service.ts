import { Injectable } from '@nestjs/common';
import {
  NOUL_THRESHOLDS,
  NO_CONFIDENCE_LABEL,
  TRIAGE_CONFIDENCE,
} from '../../jev/constants/triage-thresholds.constant.js';
import {
  ESCALATE_IF_CHILD,
  PRIORITY_ESCALATION,
  PROTOCOL_ORDER,
} from '../constants/triage-protocol.constant.js';
import type {
  RedFlags,
  TriageOutcome,
  TriagePriority,
} from '../interfaces/triage.interface.js';

/**
 * Aplica el protocolo de triaje.
 *
 * Jev entrega banderas rojas atómicas; ESTE servicio decide la prioridad.
 * Por eso las reglas están en código: se leen, se versionan y se discuten con
 * personal médico sin tocar el modelo.
 *
 * Se midió por qué: preguntarle la prioridad directamente a Jev daba
 * confianzas de 0.48–0.54 incluso en casos de libro, porque la urgencia pesa
 * varios factores a la vez. Descompuesta en banderas atómicas, cada respuesta
 * sube a 0.90–0.99.
 */
@Injectable()
export class TriageProtocolService {
  apply(input: {
    flags: RedFlags;
    requiredCapability: string;
    capabilityConfidence: number | null;
  }): TriageOutcome {
    const { flags, requiredCapability, capabilityConfidence } = input;
    const raised = (value: number) => value >= NOUL_THRESHOLDS.redFlag;

    // Reglas EN ORDEN. Gana la primera que dispara.
    let rule = PROTOCOL_ORDER.find((r) => {
      switch (r.id) {
        case 'R1_VIA_AEREA': return raised(flags.airwayCompromised);
        case 'R2_NO_RESPONDE': return raised(flags.unresponsive);
        case 'R3_DOLOR_CARDIACO': return raised(flags.cardiacChestPain);
        case 'R4_ACV': return raised(flags.strokeSigns);
        case 'R5_SANGRADO': return raised(flags.severeBleeding);
        case 'R6_TRAUMA_ALTA_ENERGIA': return raised(flags.highEnergyTrauma);
        case 'R7_REQUIERE_ESPECIALIDAD': return requiredCapability !== 'urgencias_generales';
        case 'R8_SIN_BANDERAS': return true;
        default: return false;
      }
    });

    rule ??= PROTOCOL_ORDER[PROTOCOL_ORDER.length - 1];

    let priority: TriagePriority = rule.priority;
    let rationale = rule.rationale;

    // Paciente pediátrico: sube un nivel, criterio conservador.
    if (ESCALATE_IF_CHILD && raised(flags.isChild) && priority !== 'critica') {
      priority = PRIORITY_ESCALATION[priority];
      rationale += ' Se elevó un nivel por tratarse de un paciente pediátrico.';
    }

    // Confianza insuficiente en la capacidad requerida: no se despacha solo.
    const lowConfidence =
      capabilityConfidence === null ||
      capabilityConfidence < TRIAGE_CONFIDENCE.floor;

    if (lowConfidence) {
      return {
        priority,
        decision: 'revision_humana',
        ruleFired: rule.id,
        rationale:
          `${rationale} La confianza sobre el servicio requerido es insuficiente ` +
          `(${capabilityConfidence?.toFixed(2) ?? NO_CONFIDENCE_LABEL}): lo revisa una persona antes de despachar.`,
        requiresMedicalizedUnit: raised(flags.needsMedicalized),
      };
    }

    return {
      priority,
      decision: 'despachar',
      ruleFired: rule.id,
      rationale,
      requiresMedicalizedUnit:
        flags.needsMedicalized >= NOUL_THRESHOLDS.medicalized,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { AmbulancesService } from '../ambulances/ambulances.service.js';
import type { Ambulance } from '../ambulances/interfaces/ambulance.interface.js';
import { CAPABILITY_LABELS } from '../hospitals/constants/cali-hospitals.constant.js';
import { HospitalsService } from '../hospitals/hospitals.service.js';
import type { HospitalCapability } from '../hospitals/interfaces/hospital.interface.js';
import { GeoService } from '../hospitals/services/geo.service.js';
import type { TriagePriority } from '../triage/interfaces/triage.interface.js';
import {
  AVERAGE_SPEED_KMH,
  PRIORITIES_REQUIRING_TAM,
  REJECTION_REASONS,
} from './constants/dispatch.constant.js';
import type {
  DispatchResult,
  HospitalCandidate,
} from './interfaces/dispatch.interface.js';

/**
 * Elige ambulancia y hospital.
 *
 * Aquí no hay nada más que ARITMÉTICA y reglas: distancias, filtros, orden. Ninguna
 * de estas decisiones se le pregunta a Jev, porque jev-1.13 no compara
 * magnitudes de forma fiable.
 *
 * Jev aporta UNA cosa: qué servicio necesita el paciente. Ese dato cambia por
 * completo el resultado — es lo que hace que el hospital elegido no sea
 * siempre el más cercano.
 */
@Injectable()
export class DispatchService {
  constructor(
    private readonly ambulances: AmbulancesService,
    private readonly hospitals: HospitalsService,
    private readonly geo: GeoService,
  ) {}

  dispatch(input: {
    incidentLat: number;
    incidentLng: number;
    requiredCapability: HospitalCapability;
    priority: TriagePriority;
    requiresMedicalizedUnit: boolean;
  }): DispatchResult {
    const startedAt = Date.now();
    const incident = { latitude: input.incidentLat, longitude: input.incidentLng };

    // ── 1. Ambulancia: la más cercana que esté libre y sirva ──
    const needsTam =
      input.requiresMedicalizedUnit ||
      PRIORITIES_REQUIRING_TAM.includes(input.priority as never);

    const available = this.ambulances
      .findAvailable()
      .filter((a) => (needsTam ? a.type === 'TAM' : true));

    const ambulance = this.nearestAmbulance(available, incident);

    // ── 2. Se evalúa cada hospital y se guarda por qué se descartó ──
    const all = this.hospitals.findAll();
    const ranked = this.hospitals.sortByDistance(all, incident);

    const candidates: HospitalCandidate[] = ranked.map(({ hospital, distanceKm }) => {
      const hasCapability = hospital.capabilities.includes(input.requiredCapability);
      const hasBeds = hospital.availableBeds > 0;

      return {
        code: hospital.code,
        name: hospital.name,
        distanceKm: Number(distanceKm.toFixed(2)),
        etaMinutes: this.geo.etaMinutes(distanceKm, AVERAGE_SPEED_KMH),
        eligible: hasCapability && hasBeds,
        rejectedReason: !hasCapability
          ? REJECTION_REASONS.noCapability(
              CAPABILITY_LABELS[input.requiredCapability] ?? input.requiredCapability,
            )
          : !hasBeds
            ? REJECTION_REASONS.noBeds
            : null,
      };
    });

    const chosen = candidates.find((c) => c.eligible) ?? null;
    const nearest = candidates[0] ?? null;

    // ── 3. El hallazgo: ¿el más cercano NO es el elegido? ──
    const nearestOverruled =
      nearest && chosen && nearest.code !== chosen.code
        ? {
            code: nearest.code,
            name: nearest.name,
            distanceKm: nearest.distanceKm,
            reason: nearest.rejectedReason ?? REJECTION_REASONS.notEligible,
          }
        : null;

    const blockedReason = !ambulance
      ? needsTam
        ? 'No hay unidades medicalizadas disponibles'
        : 'No hay ambulancias disponibles'
      : !chosen
        ? 'Ningún hospital con la capacidad requerida tiene camas disponibles'
        : null;

    const ambulanceDistanceKm = ambulance
      ? Number(this.geo.distanceKm(ambulance, incident).toFixed(2))
      : null;

    return {
      ambulanceId: ambulance?.id ?? null,
      ambulanceCode: ambulance?.code ?? null,
      ambulanceDistanceKm,
      ambulanceEtaMinutes:
        ambulanceDistanceKm === null
          ? null
          : this.geo.etaMinutes(ambulanceDistanceKm, AVERAGE_SPEED_KMH),
      hospitalCode: chosen?.code ?? null,
      hospitalName: chosen?.name ?? null,
      hospitalDistanceKm: chosen?.distanceKm ?? null,
      hospitalEtaMinutes: chosen?.etaMinutes ?? null,
      candidates,
      nearestOverruled,
      blockedReason,
      latencyMs: Date.now() - startedAt,
    };
  }

  private nearestAmbulance(
    fleet: Ambulance[],
    incident: { latitude: number; longitude: number },
  ): Ambulance | null {
    if (!fleet.length) return null;
    return fleet
      .map((a) => ({ a, d: this.geo.distanceKm(a, incident) }))
      .sort((x, y) => x.d - y.d)[0].a;
  }
}

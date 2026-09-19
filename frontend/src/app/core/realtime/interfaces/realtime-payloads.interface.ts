import type {
  Ambulance,
  Emergency,
  HospitalCandidate,
  TriageAssessment,
} from '../../models/emergency.model';

export interface EmergencyReceivedPayload {
  emergency: Emergency;
}

export interface EmergencyTriagedPayload {
  emergencyId: string;
  emergency: Emergency;
  assessment: TriageAssessment;
}

export interface EmergencyDispatchedPayload {
  emergencyId: string;
  emergency: Emergency;
  dispatch: {
    ambulanceCode: string | null;
    hospitalName: string | null;
    candidates: HospitalCandidate[];
    latencyMs: number;
  };
  ambulances: Ambulance[];
}

export interface FleetUpdatedPayload {
  ambulances: Ambulance[];
}

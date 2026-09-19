import type { Ambulance } from '../../ambulances/interfaces/ambulance.interface.js';
import type { DispatchResult } from '../../dispatch/interfaces/dispatch.interface.js';
import type {
  AssessmentDto,
  EmergencyDto,
} from '../../emergencies/interfaces/emergency-dto.interface.js';

export interface EmergencyReceivedPayload {
  emergency: EmergencyDto;
}

export interface EmergencyTriagedPayload {
  emergencyId: string;
  emergency: EmergencyDto;
  assessment: AssessmentDto;
}

export interface EmergencyDispatchedPayload {
  emergencyId: string;
  emergency: EmergencyDto;
  dispatch: DispatchResult;
  ambulances: Ambulance[];
}

export interface FleetUpdatedPayload {
  ambulances: Ambulance[];
}

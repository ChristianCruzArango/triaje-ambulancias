import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AiStats,
  Ambulance,
  Emergency,
  Hospital,
} from '../models/emergency.model';
import type { CaliAddress } from './interfaces/cali-address.interface';
import type { SimulatorState } from './interfaces/simulator-state.interface';

/** Único punto de entrada HTTP hacia NestJS. */
@Injectable({ providedIn: 'root' })
export class EmergenciesApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(limit = 60): Observable<Emergency[]> {
    return this.http.get<Emergency[]>(`${this.base}/emergencies`, {
      params: new HttpParams().set('limit', limit),
    });
  }

  getById(id: string): Observable<Emergency> {
    return this.http.get<Emergency>(`${this.base}/emergencies/${id}`);
  }

  /** Alta manual: es lo que usa el micrófono. */
  create(body: {
    reportText: string;
    source: string;
    addressLabel: string;
    latitude: number;
    longitude: number;
  }): Observable<Emergency> {
    return this.http.post<Emergency>(`${this.base}/emergencies`, body);
  }

  getAmbulances(): Observable<Ambulance[]> {
    return this.http.get<Ambulance[]>(`${this.base}/ambulances`);
  }

  redeployFleet(): Observable<Ambulance[]> {
    return this.http.post<Ambulance[]>(`${this.base}/ambulances/redeploy`, {});
  }

  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(`${this.base}/hospitals`);
  }

  getAiStats(): Observable<AiStats> {
    return this.http.get<AiStats>(`${this.base}/stats/ai`);
  }

  /** Direcciones donde puede ocurrir un incidente. */
  getAddresses(): Observable<CaliAddress[]> {
    return this.http.get<CaliAddress[]>(`${this.base}/simulator/addresses`);
  }

  getSimulatorState(): Observable<SimulatorState> {
    return this.http.get<SimulatorState>(`${this.base}/simulator/state`);
  }

  /** Botón "Generar llamada". */
  generateCall(): Observable<Emergency> {
    return this.http.post<Emergency>(`${this.base}/simulator/call`, {});
  }

  pause(): Observable<SimulatorState> {
    return this.http.post<SimulatorState>(`${this.base}/simulator/pause`, {});
  }

  resume(): Observable<SimulatorState> {
    return this.http.post<SimulatorState>(`${this.base}/simulator/resume`, {});
  }
}

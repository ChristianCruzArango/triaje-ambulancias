import { Injectable } from '@nestjs/common';
import { HOSPITALS } from './constants/cali-hospitals.constant.js';
import type {
  Hospital,
  HospitalCapability,
} from './interfaces/hospital.interface.js';
import type { GeoPoint } from './interfaces/geo-point.interface.js';
import { GeoService } from './services/geo.service.js';

@Injectable()
export class HospitalsService {
  constructor(private readonly geo: GeoService) {}

  findAll(): Hospital[] {
    return HOSPITALS;
  }

  findByCode(code: string): Hospital | undefined {
    return HOSPITALS.find((h) => h.code === code);
  }

  nameOf(code: string): string {
    return this.findByCode(code)?.name ?? code;
  }

  /** Hospitales que tienen la capacidad requerida y camas libres. */
  findCapableOf(capability: HospitalCapability): Hospital[] {
    return HOSPITALS.filter(
      (h) => h.capabilities.includes(capability) && h.availableBeds > 0,
    );
  }

  /** Ordena hospitales por distancia a un punto. */
  sortByDistance(
    hospitals: Hospital[],
    from: GeoPoint,
  ): { hospital: Hospital; distanceKm: number }[] {
    return hospitals
      .map((hospital) => ({
        hospital,
        distanceKm: this.geo.distanceKm(from, hospital),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}

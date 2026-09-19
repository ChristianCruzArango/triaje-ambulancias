import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GoogleMapsLoader } from '../../../core/maps/google-maps-loader.service';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import {
  buildAmbulanceSvg,
  buildHospitalSvg,
  buildIncidentSvg,
} from '../constants/map-icons.constant';
import {
  AMBULANCE_FOLLOW_ZOOM,
  INCIDENT_FOCUS_ZOOM,
  ROUTE_BOUNDS_PADDING,
  ROUTE_STROKE,
} from '../constants/map-style.constant';
import { PRIORITY_COLORS } from '../constants/priority-colors.constant';
import type {
  AmbulanceMarker,
  IncidentMarker,
} from '../interfaces/map-markers.interface';
import { MarkerAnimationService } from '../services/marker-animation.service';

/**
 * Mapa de Cali con la flota, los hospitales y los incidentes activos.
 *
 * El color de cada incidente es la prioridad que calculó el protocolo a partir
 * de las banderas de Jev. El hospital elegido se resalta y se dibuja la ruta
 * incidente → hospital.
 */
@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.html',
  styleUrl: './live-map.scss',
})
export class LiveMap {
  private readonly loader = inject(GoogleMapsLoader);
  private readonly store = inject(EmergenciesStore);
  private readonly animation = inject(MarkerAnimationService);

  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('mapHost');

  protected readonly ready = this.loader.loaded;
  protected readonly failed = this.loader.failed;

  private map?: google.maps.Map;
  private readonly ambulances = new Map<string, AmbulanceMarker>();
  private readonly incidents = new Map<string, IncidentMarker>();
  private hospitalMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
  private routeLines: google.maps.Polyline[] = [];
  /** Evita volver a encuadrar la misma emergencia en cada tick de la flota. */
  private focusedEmergencyId: string | null = null;
  /** Para acercar solo la primera vez que se fija una ambulancia. */
  private lastFollowedId: string | null = null;

  constructor() {
    void this.loader.load().catch(() => undefined);

    effect(() => {
      if (this.ready() && !this.map) this.createMap();
    });
    effect(() => {
      const fleet = this.store.ambulances();
      if (this.map) this.syncAmbulances(fleet);
    });
    effect(() => {
      const active = this.store.activeEmergencies();
      if (this.map) this.syncIncidents(active);
    });
    effect(() => {
      const selected = this.store.selected();
      const hospitals = this.store.hospitals();
      if (this.map) this.syncHospitals(hospitals, selected?.hospitalCode ?? null);
      if (this.map && selected) this.drawRoute(selected);
    });

    // El mapa se para donde entró la llamada, antes de que haya hospital.
    effect(() => {
      const selected = this.store.selected();
      if (!this.map || !selected) return;
      if (selected.id === this.focusedEmergencyId) return;
      this.focusedEmergencyId = selected.id;
      this.focusIncident(selected.latitude, selected.longitude);
    });

    // Seguir una ambulancia: el mapa la persigue mientras se mueve.
    effect(() => {
      const followedId = this.store.followedAmbulanceId();
      const fleet = this.store.ambulances();
      if (!this.map || !followedId) return;

      const unit = fleet.find((a) => a.id === followedId);
      if (!unit) return;

      // Al fijarla por primera vez se acerca; después solo la mantiene centrada.
      if (followedId !== this.lastFollowedId) {
        this.lastFollowedId = followedId;
        this.map.setZoom(AMBULANCE_FOLLOW_ZOOM);
      }
      this.map.panTo({ lat: unit.latitude, lng: unit.longitude });
    });
  }

  private createMap(): void {
    this.map = new google.maps.Map(this.host().nativeElement, {
      center: environment.mapDefaultCenter,
      zoom: environment.mapDefaultZoom,
      mapId: environment.mapId,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    });
    this.syncAmbulances(this.store.ambulances());
    this.syncIncidents(this.store.activeEmergencies());
    this.syncHospitals(this.store.hospitals(), null);
  }

  // ── Ambulancias ──

  private syncAmbulances(fleet: ReturnType<EmergenciesStore['ambulances']>): void {
    for (const unit of fleet) {
      const target = { lat: unit.latitude, lng: unit.longitude };
      const existing = this.ambulances.get(unit.id);

      if (!existing) {
        this.ambulances.set(unit.id, this.createAmbulance(unit, target));
        continue;
      }

      const followed = unit.id === this.store.followedAmbulanceId();
      if (existing.status !== unit.status || existing.followed !== followed) {
        existing.status = unit.status;
        existing.followed = followed;
        this.paintAmbulance(existing);
      }

      const moved =
        Math.abs(existing.position.lat - target.lat) > 1e-6 ||
        Math.abs(existing.position.lng - target.lng) > 1e-6;

      if (moved) {
        if (existing.animationFrame) cancelAnimationFrame(existing.animationFrame);

        // Se parte de donde el marcador está AHORA, no del objetivo anterior:
        // si la animación se cortó a medias, arrancar del objetivo daría un
        // salto hacia atrás.
        const from = this.currentPosition(existing);
        existing.element.classList.toggle('unit--west', this.animation.facesWest(from, target));
        existing.animationFrame = this.animation.tween(from, target, (p) => {
          existing.marker.position = p;
        });
        existing.position = target;
      }
    }
  }

  /** Dónde está el marcador ahora mismo, aunque esté a media animación. */
  private currentPosition(unit: AmbulanceMarker): google.maps.LatLngLiteral {
    const live = unit.marker.position;
    if (!live) return { ...unit.position };
    return typeof live.lat === 'function'
      ? { lat: (live as google.maps.LatLng).lat(), lng: (live as google.maps.LatLng).lng() }
      : { lat: live.lat as number, lng: live.lng as number };
  }

  private createAmbulance(
    unit: { id: string; code: string; status: string },
    position: google.maps.LatLngLiteral,
  ): AmbulanceMarker {
    const element = document.createElement('div');
    element.className = 'unit';

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position,
      content: element,
      title: unit.code,
    });

    marker.addListener('click', () => this.store.toggleFollow(unit.id));

    const entry: AmbulanceMarker = {
      id: unit.id,
      code: unit.code,
      marker,
      element,
      position,
      status: unit.status,
      followed: unit.id === this.store.followedAmbulanceId(),
    };
    this.paintAmbulance(entry);
    return entry;
  }

  private paintAmbulance(unit: AmbulanceMarker): void {
    const busy = unit.status !== 'disponible';
    const color = busy ? '#ef4444' : '#64748b';
    unit.element.innerHTML = `
      <div class="unit__body">${buildAmbulanceSvg(color, busy)}</div>
      <span class="unit__code">${unit.code}</span>`;
    unit.element.classList.toggle('unit--busy', busy);
    unit.element.classList.toggle('unit--followed', unit.followed);
  }

  // ── Incidentes ──

  private syncIncidents(list: ReturnType<EmergenciesStore['activeEmergencies']>): void {
    const seen = new Set<string>();

    for (const emergency of list) {
      seen.add(emergency.id);
      const priority =
        emergency.status === 'REVISION'
          ? 'revision'
          : (emergency.priority ?? 'pendiente');
      const existing = this.incidents.get(emergency.id);

      if (existing) {
        if (existing.priority !== priority) {
          existing.priority = priority;
          this.paintIncident(existing, emergency.callCode);
        }
        continue;
      }

      const element = document.createElement('div');
      element.className = 'incident';
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: emergency.latitude, lng: emergency.longitude },
        content: element,
        title: emergency.addressLabel,
        // Por encima de hospitales y ambulancias: es el punto de la llamada.
        zIndex: 1000,
      });
      marker.addListener('click', () => this.store.select(emergency.id));

      const entry: IncidentMarker = { id: emergency.id, marker, element, priority };
      this.paintIncident(entry, emergency.callCode);
      this.incidents.set(emergency.id, entry);
    }

    for (const [id, incident] of this.incidents) {
      if (seen.has(id)) continue;
      incident.marker.map = null;
      this.incidents.delete(id);
    }
  }

  private paintIncident(incident: IncidentMarker, label: string): void {
    const color = PRIORITY_COLORS[incident.priority] ?? PRIORITY_COLORS['pendiente'];
    incident.element.innerHTML =
      `${buildIncidentSvg(color)}` +
      `<span style="border-color:${color};color:${color}">📞 ${label}</span>`;
    incident.element.classList.toggle('incident--critical', incident.priority === 'critica');
  }

  // ── Hospitales ──

  private syncHospitals(
    hospitals: ReturnType<EmergenciesStore['hospitals']>,
    chosenCode: string | null,
  ): void {
    this.hospitalMarkers.forEach((m) => (m.map = null));
    this.hospitalMarkers = hospitals.map((hospital) => {
      const chosen = hospital.code === chosenCode;
      const element = document.createElement('div');
      element.className = chosen ? 'hospital hospital--chosen' : 'hospital';
      element.innerHTML = `${buildHospitalSvg(chosen)}<span>${hospital.name}</span>`;

      return new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: hospital.latitude, lng: hospital.longitude },
        content: element,
        title: hospital.name,
      });
    });
  }

  /** Acerca el mapa al punto del incidente. */
  private focusIncident(lat: number, lng: number): void {
    this.map?.panTo({ lat, lng });
    this.map?.setZoom(INCIDENT_FOCUS_ZOOM);
  }

  // ── Ruta del despacho ──

  private drawRoute(emergency: ReturnType<EmergenciesStore['selected']>): void {
    this.routeLines.forEach((l) => l.setMap(null));
    this.routeLines = [];
    if (!emergency?.hospitalCode) return;

    const hospital = this.store
      .hospitals()
      .find((h) => h.code === emergency.hospitalCode);
    if (!hospital) return;

    const incident = { lat: emergency.latitude, lng: emergency.longitude };

    this.routeLines.push(
      new google.maps.Polyline({
        map: this.map,
        path: [incident, { lat: hospital.latitude, lng: hospital.longitude }],
        strokeColor: ROUTE_STROKE.toHospital.color,
        strokeWeight: ROUTE_STROKE.toHospital.weight,
        strokeOpacity: 0.9,
      }),
    );

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(incident);
    bounds.extend({ lat: hospital.latitude, lng: hospital.longitude });
    this.map?.fitBounds(bounds, ROUTE_BOUNDS_PADDING);
  }
}

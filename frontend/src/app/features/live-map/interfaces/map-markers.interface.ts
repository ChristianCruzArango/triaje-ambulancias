/** Una ambulancia viva en el mapa y su animación en curso. */
export interface AmbulanceMarker {
  id: string;
  code: string;
  marker: google.maps.marker.AdvancedMarkerElement;
  element: HTMLElement;
  position: google.maps.LatLngLiteral;
  status: string;
  /** `true` si el mapa la está siguiendo. */
  followed: boolean;
  /** Handle de requestAnimationFrame, para cancelar el tween. */
  animationFrame?: number;
}

/** Un incidente dibujado en el mapa. */
export interface IncidentMarker {
  id: string;
  marker: google.maps.marker.AdvancedMarkerElement;
  element: HTMLElement;
  priority: string;
}

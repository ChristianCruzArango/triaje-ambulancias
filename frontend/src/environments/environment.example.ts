export const environment = {
  production: false,

  // ── Backend ──
  apiUrl: 'http://localhost:3000',
  wsUrl: 'http://localhost:3000',

  // ── Google Maps ──
  /** Endpoint del cargador de Maps JavaScript API. */
  googleMapsScriptUrl: 'https://maps.googleapis.com/maps/api/js',
  /**
   * Clave de Maps JavaScript API. Es pública por diseño: viaja en el bundle
   * del navegador. Se protege restringiéndola en Google Cloud Console por
   * referente HTTP y por API, no ocultándola.
   */
  googleMapsApiKey: 'PON_AQUI_TU_CLAVE_DE_GOOGLE_MAPS',
  /** Librerías que se cargan. */
  googleMapsLibraries: 'maps,marker,geometry',
  googleMapsVersion: 'weekly',
  googleMapsLanguage: 'es',
  googleMapsRegion: 'CO',
  /**
   * Map ID. `DEMO_MAP_ID` es el identificador de prueba que documenta Google;
   * para producción se crea uno propio en Google Cloud Console.
   */
  mapId: 'DEMO_MAP_ID',

  // ── Vista inicial: Cali ──
  mapDefaultCenter: { lat: 3.44, lng: -76.52 },
  mapDefaultZoom: 12,
};

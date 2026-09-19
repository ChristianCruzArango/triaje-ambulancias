/**
 * Direcciones reales de Cali desde donde entran las llamadas.
 *
 * Coordenadas geocodificadas con Nominatim (OpenStreetMap) y congeladas aquí.
 * En tiempo de ejecución no se geocodifica nada.
 *
 * Están repartidas por toda la ciudad a propósito — norte, centro, sur,
 * oriente y ladera — para que el despacho tenga que elegir de verdad.
 */
export interface CaliAddress {
  label: string;
  zone: string;
  latitude: number;
  longitude: number;
}

export const CALI_ADDRESSES: CaliAddress[] = [
  { label: 'Menga, Av. 6 Norte con Calle 70', zone: 'Comuna 2', latitude: 3.49191, longitude: -76.52583 },
  { label: 'Chipichape, Calle 38 Norte', zone: 'Comuna 2', latitude: 3.47654, longitude: -76.52815 },
  { label: 'Terminal de Transportes, Calle 30 Norte', zone: 'Comuna 2', latitude: 3.4651, longitude: -76.52161 },
  { label: 'Versalles, Av. 4 Norte con Calle 22N', zone: 'Comuna 2', latitude: 3.46123, longitude: -76.52878 },
  { label: 'Granada, Av. 9 Norte con Calle 15N', zone: 'Comuna 2', latitude: 3.45926, longitude: -76.53358 },
  { label: 'Plaza de Caicedo, Carrera 5 con Calle 12', zone: 'Comuna 3', latitude: 3.45271, longitude: -76.53152 },
  { label: 'San Antonio, Carrera 10 con Calle 3', zone: 'Comuna 3', latitude: 3.44741, longitude: -76.53854 },
  { label: 'Santa Mónica, Transversal 25', zone: 'Comuna 2', latitude: 3.4347, longitude: -76.51402 },
  { label: 'Estadio Pascual Guerrero, Carrera 36', zone: 'Comuna 19', latitude: 3.42991, longitude: -76.54112 },
  { label: 'Calipso, Calle 44 con Carrera 26', zone: 'Comuna 13', latitude: 3.42442, longitude: -76.49731 },
  { label: 'Siloé, Carrera 50 con Calle 2 Oeste', zone: 'Comuna 20', latitude: 3.42031, longitude: -76.55555 },
  { label: 'El Vallado, Calle 72 con Carrera 28D', zone: 'Comuna 15', latitude: 3.40624, longitude: -76.49942 },
  { label: 'El Ingenio, Calle 13 con Carrera 85', zone: 'Comuna 17', latitude: 3.38255, longitude: -76.53111 },
  { label: 'Unicentro, Carrera 100', zone: 'Comuna 17', latitude: 3.37718, longitude: -76.53944 },
  { label: 'Valle del Lili, Carrera 98 con Calle 25', zone: 'Comuna 17', latitude: 3.37424, longitude: -76.52433 },
  { label: 'Ciudad Jardín, Carrera 105 con Calle 16', zone: 'Comuna 22', latitude: 3.36632, longitude: -76.53617 },
  { label: 'Pance, Vía a Pance Km 3', zone: 'Comuna 22', latitude: 3.32287, longitude: -76.60964 },
];

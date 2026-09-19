import type { Hospital } from '../interfaces/hospital.interface.js';

/**
 * Hospitales reales de Cali.
 *
 * ⚠️ IMPORTANTE — qué es real y qué no:
 *   • Los NOMBRES y las COORDENADAS son reales. Se geocodificaron con
 *     Nominatim (OpenStreetMap) y quedaron congelados aquí.
 *   • Las CAPACIDADES y las CAMAS DISPONIBLES son DATOS DE DEMOSTRACIÓN.
 *     Están asignadas de forma plausible según el nivel de complejidad
 *     conocido de cada institución, pero NO se verificaron con ninguna
 *     fuente oficial y no deben tomarse como información real de servicios.
 *     En un sistema de verdad vendrían del sistema de cada hospital.
 */
export const HOSPITALS: Hospital[] = [
  {
    code: 'HUV',
    name: 'Hospital Universitario del Valle',
    address: 'Carrera 36 # 5B-08',
    zone: 'Comuna 19',
    latitude: 3.43018,
    longitude: -76.54544,
    level: 'alta_complejidad',
    capabilities: ['urgencias_generales', 'trauma_mayor', 'unidad_acv', 'hemodinamia', 'quemados', 'pediatria', 'obstetricia', 'uci_adultos'],
    availableBeds: 6,
  },
  {
    code: 'VALLE-LILI',
    name: 'Fundación Valle del Lili',
    address: 'Carrera 98 # 18-49',
    zone: 'Comuna 22',
    latitude: 3.35024,
    longitude: -76.51512,
    level: 'alta_complejidad',
    capabilities: ['urgencias_generales', 'trauma_mayor', 'unidad_acv', 'hemodinamia', 'pediatria', 'obstetricia', 'uci_adultos'],
    availableBeds: 8,
  },
  {
    code: 'IMBANACO',
    name: 'Centro Médico Imbanaco',
    address: 'Carrera 38A # 5A-100',
    zone: 'Comuna 19',
    latitude: 3.42371,
    longitude: -76.54399,
    level: 'alta_complejidad',
    capabilities: ['urgencias_generales', 'unidad_acv', 'hemodinamia', 'pediatria', 'uci_adultos'],
    availableBeds: 5,
  },
  {
    code: 'OCCIDENTE',
    name: 'Clínica de Occidente',
    address: 'Calle 18N # 5-34',
    zone: 'Comuna 2',
    latitude: 3.46047,
    longitude: -76.53018,
    level: 'alta_complejidad',
    capabilities: ['urgencias_generales', 'trauma_mayor', 'hemodinamia', 'uci_adultos'],
    availableBeds: 4,
  },
  {
    code: 'FARALLONES',
    name: 'Clínica Farallones',
    address: 'Calle 9C # 51-30',
    zone: 'Comuna 19',
    latitude: 3.41008,
    longitude: -76.53945,
    level: 'intermedio',
    capabilities: ['urgencias_generales', 'obstetricia', 'pediatria'],
    availableBeds: 7,
  },
  {
    code: 'REMEDIOS',
    name: 'Clínica Nuestra Señora de los Remedios',
    address: 'Avenida 2 Norte # 24N-157',
    zone: 'Comuna 2',
    latitude: 3.46324,
    longitude: -76.52255,
    level: 'intermedio',
    capabilities: ['urgencias_generales', 'uci_adultos'],
    availableBeds: 5,
  },
  {
    code: 'SAN-JUAN-DIOS',
    name: 'Hospital San Juan de Dios',
    address: 'Carrera 4 # 21-30',
    zone: 'Comuna 3',
    latitude: 3.45502,
    longitude: -76.52796,
    level: 'intermedio',
    capabilities: ['urgencias_generales', 'obstetricia'],
    availableBeds: 9,
  },
  {
    code: 'VERSALLES',
    name: 'Clínica Versalles',
    address: 'Avenida 5AN # 23DN-70',
    zone: 'Comuna 2',
    latitude: 3.46403,
    longitude: -76.52771,
    level: 'intermedio',
    capabilities: ['urgencias_generales', 'quemados', 'uci_adultos'],
    availableBeds: 3,
  },
  {
    code: 'HOLMES-TRUJILLO',
    name: 'Hospital Carlos Holmes Trujillo',
    address: 'Calle 72W # 26-40',
    zone: 'Comuna 13',
    latitude: 3.4187,
    longitude: -76.49413,
    level: 'basico',
    capabilities: ['urgencias_generales', 'pediatria'],
    availableBeds: 11,
  },
  {
    code: 'DUARTE-CANCINO',
    name: 'Hospital Isaías Duarte Cancino',
    address: 'Calle 121 # 26F-50',
    zone: 'Comuna 21',
    latitude: 3.4118,
    longitude: -76.48573,
    level: 'basico',
    capabilities: ['urgencias_generales', 'obstetricia'],
    availableBeds: 12,
  },
  {
    code: 'AMIGA',
    name: 'Clínica Amiga Comfandi',
    address: 'Calle 25 # 34-10',
    zone: 'Comuna 11',
    latitude: 3.39323,
    longitude: -76.52538,
    level: 'intermedio',
    capabilities: ['urgencias_generales', 'pediatria', 'obstetricia'],
    availableBeds: 6,
  },
  {
    code: 'MARIO-CORREA',
    name: 'Hospital Mario Correa Rengifo',
    address: 'Carrera 50 # 4-10',
    zone: 'Comuna 20',
    latitude: 3.38712,
    longitude: -76.55798,
    level: 'basico',
    capabilities: ['urgencias_generales'],
    availableBeds: 10,
  },
];

/** Etiquetas en español para la interfaz. */
export const CAPABILITY_LABELS: Record<string, string> = {
  urgencias_generales: 'Urgencias generales',
  unidad_acv: 'Unidad de ACV',
  trauma_mayor: 'Trauma mayor',
  hemodinamia: 'Hemodinamia',
  quemados: 'Unidad de quemados',
  pediatria: 'Pediatría',
  obstetricia: 'Obstetricia',
  uci_adultos: 'UCI adultos',
};

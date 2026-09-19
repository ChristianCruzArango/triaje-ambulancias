/**
 * Caja geográfica de Cali para repartir la flota al azar.
 * Aproximadamente del norte (Menga) al sur (Pance) y de oeste a este.
 */
export const CALI_BOUNDS = {
  minLat: 3.33,
  maxLat: 3.50,
  minLng: -76.58,
  maxLng: -76.47,
} as const;

/** Cuántas ambulancias tiene la flota de demostración. */
export const FLEET_SIZE = 8;

/** Proporción de unidades medicalizadas. El resto son básicas. */
export const MEDICALIZED_RATIO = 0.5;

/** Etiquetas en español para la interfaz. */
export const STATUS_LABELS: Record<string, string> = {
  disponible: 'Disponible',
  en_camino: 'En camino',
  en_sitio: 'En sitio',
  trasladando: 'Trasladando',
  en_hospital: 'En hospital',
};

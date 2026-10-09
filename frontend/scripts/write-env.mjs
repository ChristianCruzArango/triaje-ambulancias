/**
 * Genera los archivos de entorno a partir de variables de entorno.
 *
 * Los `environment*.ts` reales no se versionan (llevan la clave de Maps), así
 * que en un despliegue (Railway) se crean aquí antes de `ng build`, partiendo
 * de las plantillas `*.example.ts`.
 *
 *   API_URL              URL pública del backend (también se usa para el WebSocket)
 *   GOOGLE_MAPS_API_KEY  Clave de Maps JavaScript API
 *   GOOGLE_MAPS_MAP_ID   Map ID propio (opcional, por defecto DEMO_MAP_ID)
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(import.meta.dirname, '..', 'src', 'environments');
const { API_URL, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID } = process.env;

if (!API_URL || !GOOGLE_MAPS_API_KEY) {
  console.error('Faltan API_URL o GOOGLE_MAPS_API_KEY.');
  process.exit(1);
}

// `environment.ts` debe existir aunque producción lo reemplace en el build.
const devFile = join(dir, 'environment.ts');
if (!existsSync(devFile)) {
  writeFileSync(devFile, readFileSync(join(dir, 'environment.example.ts')));
}

const production = readFileSync(join(dir, 'environment.production.example.ts'), 'utf8')
  .replace("apiUrl: '/api'", `apiUrl: '${API_URL}'`)
  .replace("wsUrl: '/'", `wsUrl: '${API_URL}'`)
  .replace('PON_AQUI_TU_CLAVE_DE_GOOGLE_MAPS', GOOGLE_MAPS_API_KEY)
  .replace("mapId: 'DEMO_MAP_ID'", `mapId: '${GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}'`);

writeFileSync(join(dir, 'environment.production.ts'), production);
console.log(`Entorno de producción generado (API_URL=${API_URL}).`);

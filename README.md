# Triaje de emergencias y despacho de ambulancias — Cali

Demostración de **Jev** (TypeSafe System One): entra una llamada de emergencia,
Jev la convierte en hechos tipados, un protocolo en código calcula la prioridad
y el despacho elige ambulancia y hospital. Todo en vivo sobre un mapa de Cali.

> **DEMOSTRACIÓN.** Las llamadas son ficticias y las ambulancias son simuladas.
> Un sistema que prioriza pacientes de verdad es un dispositivo médico regulado
> y necesita validación clínica. Esto no lo es.

## Lo que demuestra

Llega esta llamada:

> *"Mi abuelo tiene la boca torcida y no puede hablar bien desde hace un rato"*

En **216 ms** y por **$0.000045**, Jev responde `unidad_acv` con confianza 1,00
y `stroke_signs` 0,96. El protocolo dispara `R4_ACV` → **Crítica**. Y el
despacho, en **menos de 1 ms**, decide:

```
⚠ El hospital más cercano era Hospital San Juan de Dios, a 2,74 km.
  Se descartó: no cuenta con Unidad de ACV.
  Se despachó al Hospital Universitario del Valle, a 3,52 km.
  9 de 12 hospitales descartados por no tener el servicio.
```

**Sin Jev ese paciente va al hospital equivocado.** En las pruebas, eso ocurre
en aproximadamente la mitad de las llamadas.

## El reparto de responsabilidades

| Decisión | Quién | Por qué |
|---|---|---|
| Qué servicio necesita el paciente | **Jev** | Requiere criterio sobre texto libre |
| Banderas rojas (8 preguntas) | **Jev** | Idem, pero atómicas |
| Prioridad de triaje | **Código** | Un protocolo auditable, no un modelo |
| Ambulancia más cercana | **Código** | Es aritmética |
| Hospital más cercano **que sirva** | **Código** | Filtra por lo que dijo Jev, luego ordena |

**A Jev nunca se le pregunta la prioridad.** Se midió: esa pregunta compuesta
devolvía confianzas de 0,48–0,54 incluso en casos de libro. Descompuesta en
banderas atómicas, cada respuesta sube a 0,90–0,99. La documentación lo
advierte: si una pregunta pesa varios factores, hay que descomponerla.

## Estructura

```
triaje-ambulancias/
  docker-compose.yml      PostgreSQL 16 + Adminer
  backend/                NestJS 12 (ESM) + TypeORM + @typesafe-ai/sdk
  frontend/               Angular 22 + Google Maps + Socket.IO
```

Cada módulo tiene su propio `README.md` con qué hace y por qué.

### Backend (`backend/src/`)

| Carpeta | Responsabilidad |
|---|---|
| `jev/` | Las 9 preguntas de triaje y el cliente de System One. |
| `triage/` | El protocolo que calcula la prioridad a partir de las banderas. |
| `dispatch/` | Elige ambulancia y hospital. Pura aritmética. |
| `hospitals/` | 12 hospitales reales de Cali y cálculo de distancias. |
| `ambulances/` | La flota y su movimiento por el mapa. |
| `emergencies/` | La llamada, su evaluación y la cadena completa. |
| `simulator/` | Genera llamadas desde direcciones reales de Cali. |
| `realtime/` | Difusión por WebSocket. |
| `stats/` | Totales de uso y de despacho. |

### Frontend (`frontend/src/app/`)

| Carpeta | Responsabilidad |
|---|---|
| `features/control-room/` | La pantalla: mapa completo con paneles encima. |
| `features/call-console/` | Botón, micrófono y cuadro de transcripción. |
| `features/live-map/` | Mapa, ambulancias, hospitales e incidentes. |
| `features/jev-inspector/` | Qué se envía a Jev, qué responde, tiempo y coste. |
| `features/dispatch-panel/` | El beneficio: qué hospital y por qué. |
| `features/emergencies-list/` | Listado vivo de llamadas. |
| `features/top-bar/` | Estado, totales y controles. |

## Puesta en marcha

```bash
# 1. Credenciales de la base de datos
cp .env.example .env

# 2. Claves del backend — añadir TYPESAFE_API_KEY y OPENROUTER_API_KEY
cp backend/.env.example backend/.env

# 3. Clave de Google Maps — añadir la propia en googleMapsApiKey
cp frontend/src/environments/environment.example.ts \
   frontend/src/environments/environment.ts
cp frontend/src/environments/environment.production.example.ts \
   frontend/src/environments/environment.production.ts

# 4. Arrancar
npm run db:up          # PostgreSQL en el 5435, Adminer en el 8080
npm run install:all
npm run backend        # http://localhost:3000
npm run frontend       # http://localhost:4200
```

**Ningún archivo con claves está en el repositorio.** Los tres pasos de arriba
copian plantillas que hay que rellenar. `TYPESAFE_API_KEY` se saca en
<https://typesafe.ai>, `OPENROUTER_API_KEY` en <https://openrouter.ai/keys>, y
la de Maps en Google Cloud Console habilitando *Maps JavaScript API*.

## Los datos

**Reales:** los nombres y coordenadas de los 12 hospitales y de las 17
direcciones de incidente. Geocodificados una sola vez con Nominatim
(OpenStreetMap) y congelados en constantes; en ejecución no se geocodifica nada.

**De demostración:** las capacidades clínicas y las camas de cada hospital, los
guiones de llamada, la flota y sus posiciones. Las capacidades están asignadas
de forma plausible según el nivel de complejidad conocido, pero **no se
verificaron con ninguna fuente oficial**.

Los guiones no contienen nombres, teléfonos ni datos personales.

## Voz

El botón **Generar llamada** crea una emergencia y el navegador la **lee en voz
alta**. El botón **Hablar** transcribe tu voz en vivo con la Web Speech API:
gratis, sin clave, en Chrome.

La transcripción se equivoca, y en triaje eso es grave. Por eso el texto queda
visible y editable antes de confirmar, y si la confianza es baja el caso va a
revisión humana en vez de despacharse solo.

## Claves

| Clave | Dónde vive | Visible en el navegador |
|---|---|---|
| `TYPESAFE_API_KEY` | Backend | **No** |
| `OPENROUTER_API_KEY` | Backend | **No** |
| Google Maps | `frontend/src/environments/` | **Sí, inevitable** |

La de Maps viaja en el bundle porque el mapa se carga desde el navegador. Se
protege **restringiéndola** en Google Cloud Console (referente HTTP + solo Maps
JavaScript API), no escondiéndola. Hoy **no tiene restricciones**: hay que
ponerlas antes de exponer esto a internet.

## Límites conocidos

- Las rutas son **líneas rectas**, no calles. Para calles haría falta la
  Directions API, que se factura por petición.
- El estilo oscuro del mapa se configura en Cloud Console asociado al `mapId`:
  Google ignora `styles` cuando hay `mapId`, y el `mapId` es obligatorio para
  los marcadores avanzados.
- Los umbrales del protocolo son un punto de partida. **Deben calibrarse con
  casos reales etiquetados por personal clínico.**

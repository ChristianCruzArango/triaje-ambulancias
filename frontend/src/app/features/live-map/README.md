# `live-map/` — el mapa de Cali

## Para qué sirve

Pantalla completa. Muestra a la vez la flota, los hospitales y los incidentes
activos, sobre un mapa oscuro para que los colores resalten.

## Qué se ve

| Elemento | Cómo se dibuja |
|---|---|
| 🚑 **Ambulancia** | SVG lateral. Gris si está disponible, roja y parpadeando si está ocupada. Se voltea según la dirección. |
| 📍 **Incidente** | Círculo del **color de la prioridad**. Si es crítica, late. |
| 🏥 **Hospital** | Cuadro con cruz, apagado. **El hospital elegido se resalta en azul** y se agranda. |
| ─── **Ruta** | Línea del incidente al hospital elegido. |

## El color lo decide el protocolo, con los datos de Jev

| Color | Prioridad |
|---|---|
| 🔴 Rojo | Crítica |
| 🟠 Naranja | Alta |
| 🟡 Amarillo | Media |
| 🟢 Verde | Baja |
| 🟣 Morado | Revisión humana |
| ⚪ Gris | Jev aún no responde |

Como el backend emite `emergency.received` y `emergency.triaged` por separado,
en pantalla se ve el incidente aparecer **en gris** y cambiar de color un
instante después. Ese parpadeo es Jev respondiendo.

## Por qué SVG

Escala al hacer zoom, pesa nada, y **se recolorea en caliente** — que es
justamente lo que hace visible la decisión. Una imagen no podría.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `components/live-map.*` | Mapa y sincronización de los tres tipos de marcador. |
| `constants/map-icons.constant.ts` | SVG de ambulancia, hospital e incidente. |
| `constants/priority-colors.constant.ts` | Colores y etiquetas en español. |
| `constants/map-style.constant.ts` | Estilo oscuro, duración del tween y trazos. |
| `services/marker-animation.service.ts` | Interpolación y orientación. |
| `interfaces/map-markers.interface.ts` | Marcadores vivos. |

## Límite conocido

Las rutas son **líneas rectas**, no calles. Para rutas por carretera haría
falta la Directions API de Google, que se factura por petición.

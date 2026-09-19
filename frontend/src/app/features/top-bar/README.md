# `top-bar/` — estado del sistema y totales

## Para qué sirve

Franja superior sobre el mapa. Tres bloques.

**Izquierda — estado**
- Etiqueta fija **DEMOSTRACIÓN · datos simulados**.
- Punto de conexión del WebSocket.
- Emergencias activas y cuántas están **en revisión humana**.

**Centro — los contadores**
- **Jev**: llamadas, coste acumulado y latencia media.
- **Despacho**: *cuántas veces el hospital elegido NO fue el más cercano*, de
  cuántas en total. Es la métrica que resume el valor del sistema, y sube sola
  mientras la demostración corre.

**Derecha — controles**
- *Redistribuir flota* vuelve a repartir las ambulancias al azar por Cali.
- *Pausar / Reanudar* detiene la entrada de llamadas y el movimiento.

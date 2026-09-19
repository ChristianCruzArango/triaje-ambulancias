# `modal/` — diálogo a pantalla completa

Contenedor reutilizable. Ocupa **toda la pantalla** a propósito: estos diálogos
llevan JSON, tablas y explicaciones largas, y en un cuadro pequeño no se
alcanzan a leer.

El cuerpo se reparte en **dos columnas** cuando hay ancho de sobra, y baja a una
sola por debajo de 1.100 px. Ningún bloque se parte entre columnas.

Cierra al hacer clic en el fondo o en la ✕.

```html
<app-modal title="Título" subtitle="contexto" (closed)="cerrar()">
  …contenido…
</app-modal>
```

No sabe nada del dominio; el contenido se proyecta con `<ng-content>`.
Lo usan `jev-inspector` y `dispatch-panel` para mostrar la traza completa de
cada decisión.

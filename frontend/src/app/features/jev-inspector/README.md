# `jev-inspector/` — qué se le envía a Jev y qué responde

## Para qué sirve

Responde en pantalla las cuatro preguntas que importan:
**qué se envía, qué responde, cuánto tarda y cuánto cuesta.**

## Qué se ve

**1. Cabecera** — la versión exacta del modelo (`jev-1.13.0`, no el alias) y la
prioridad final como distintivo de color.

**2. Tiempo y coste** — tres cifras lado a lado:

| Métrica | Orden de magnitud |
|---|---|
| Respuesta de Jev | 200–750 ms |
| Coste | ~$0.000045 |
| Despacho (código) | 0–1 ms |

Esa última columna importa: **elegir ambulancia y hospital tarda menos de un
milisegundo**, porque es aritmética. Lo único que cuesta tiempo y dinero es la
parte que necesita criterio.

**3. Qué responde** — el servicio requerido con su confianza y las
probabilidades de cada opción, y debajo **las ocho banderas rojas**. Las que
superan 0,6 se pintan en rojo: son las que activaron una regla del protocolo.

**4. Qué se envía** — el JSON exacto del `state` que viajó a Jev, y las nueve
preguntas desplegables. Sale de `sentState` y `sentQuestions`, que el backend
persiste con cada evaluación; sin eso no se podría auditar una decisión.

## Por qué el estado no lleva fechas

jev-1.13 lee las fechas como texto y no sabe compararlas. Todo lo temporal se
calcula en código. La nota está visible en el panel.

## El formato del coste

`shared/pipes/cost.pipe.ts` escala los decimales. Con dos decimales todo saldría
`$0.00`.

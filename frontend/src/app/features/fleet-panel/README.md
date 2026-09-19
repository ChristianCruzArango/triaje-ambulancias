# `fleet-panel/` — la flota ordenada por cercanía

## Para qué sirve

Muestra **por qué se eligió esa ambulancia y no otra**.

Arriba, los dos extremos: la **más cercana** que podía ir y la **más lejana**
de la flota. Debajo, las 8 unidades ordenadas por distancia al incidente, con
su distancia, su tipo (medicalizada o básica), su estado y el tiempo estimado.

La despachada se marca en verde; las ocupadas se atenúan.

## Se actualiza cada segundo

Las ambulancias se mueven cada segundo, así que las distancias cambian en
vivo. El orden de la lista se recalcula solo: se ve a la unidad despachada
acercarse al incidente mientras el número baja.

## El modal «¿cómo se mide la distancia?»

Un botón junto a la lista abre la explicación completa: la fórmula de
haversine, los números reales de esta llamada, por qué la más cercana no
siempre es la que va, el JSON con las coordenadas de toda la flota, y los
límites del cálculo.

## Por qué la distancia se calcula en el navegador

`shared/geo/distance.util.ts` recalcula la distancia para poder **ordenar la
lista mientras la flota se mueve**, sin pedirle al servidor una lista nueva
cada segundo.

**La decisión no se toma aquí.** Qué ambulancia se despacha lo decide el
backend (`dispatch/`), que es la autoridad, y queda registrado en la
emergencia. Esto es solo presentación.

## Por qué la más cercana no siempre es la despachada

- Puede estar **ocupada** en otra emergencia.
- Puede ser **básica (TAB)** cuando el caso exige una **medicalizada (TAM)** —
  eso lo pide Jev con `needs_medicalized_unit`, o lo impone una prioridad
  crítica.

En esos casos se ve en la lista: la de arriba está atenuada y la verde está
más abajo.

# `dispatch-panel/` — el panel del beneficio

## Para qué sirve

Es el panel que justifica todo el sistema. Muestra a qué hospital se despachó y
**cuál se descartó, por qué**.

## El bloque que importa

Cuando el hospital más cercano NO fue el elegido, aparece arriba un recuadro
azul:

> **JEV EVITÓ UN ERROR DE DESPACHO**
> El hospital más cercano era *Clínica Nuestra Señora de los Remedios*, a
> **0,23 km**. Se descartó: no cuenta con Trauma mayor.
> Se despachó a *Clínica de Occidente* a 1,08 km.

Eso es el sistema entero en tres líneas. Sin Jev, un apuñalado va a una clínica
a 230 metros que no lo puede operar.

En las pruebas reales esto aparece en aproximadamente **2 de cada 5 llamadas**.

## Qué más se ve

- **Ambulancia y hospital** elegidos.
- **La regla del protocolo** que disparó (`R1_VIA_AEREA`, `R5_SANGRADO`…).
  Es un identificador auditable, no una frase generada.
- **El razonamiento** en español, que viene del protocolo, no de un modelo.
- **Todos los hospitales evaluados**, en orden de distancia, con los
  descartados tachados y el motivo de cada descarte.

## Por qué la lista completa

Para poder discutir la decisión. Un jefe de despacho puede mirar la lista y
decir "ese hospital sí tiene pediatría, arreglá el dato" — y es un dato, no un
prompt. Esa es la diferencia entre un sistema auditable y una caja negra.

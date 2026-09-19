# `dispatch/` — elegir ambulancia y hospital

## Para qué sirve

Decide **qué ambulancia va** y **a qué hospital lleva al paciente**.

Todo lo de aquí es aritmética y filtros. Tarda **menos de un milisegundo**.

## El aporte de Jev, en una línea

Jev entrega una sola cosa a este módulo: **qué servicio necesita el paciente**.
Ese dato cambia por completo el resultado.

```
1. Filtrar hospitales que tengan esa capacidad y camas libres
2. De esos, el más cercano al incidente
3. Guardar TODOS los evaluados y por qué se descartó cada uno
```

Sin el paso 1, el sistema manda al más cercano a secas. Con él, un ACV va a un
hospital con tomógrafo aunque esté más lejos.

## `nearestOverruled`

Cuando el hospital más cercano **no** es el elegido, se guarda cuál era, a qué
distancia y por qué se descartó. Es lo que el frontend muestra en el recuadro
azul, y es la evidencia del valor del sistema.

## La ambulancia

La más cercana que esté **libre** y que **sirva**: un caso crítico o que Jev
marque como `needs_medicalized_unit` exige una TAM. Si no hay ninguna, se
reporta el bloqueo en vez de mandar una unidad inadecuada.

## Por qué nada de esto se le pregunta a Jev

jev-1.13 no compara magnitudes numéricas de forma fiable. Distancias, filtros y
orden son trabajo de código.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `dispatch.service.ts` | El algoritmo completo. |
| `constants/dispatch.constant.ts` | Velocidad media, motivos de descarte. |
| `interfaces/dispatch.interface.ts` | Resultado y candidatos evaluados. |

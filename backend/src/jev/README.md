# `jev/` — las preguntas de triaje a TypeSafe System One

## Para qué sirve

Convierte el texto de una llamada de emergencia en **números tipados** con los
que el código puede decidir.

Jev no genera texto, no razona en voz alta y no devuelve un diagnóstico.
Responde nueve preguntas cerradas y devuelve probabilidades calibradas.

## Qué NO hace

- **No decide la prioridad.** Eso es `triage/`.
- **No elige el hospital.** Eso es `dispatch/`.
- **No emite un diagnóstico médico.** Describe lo reportado.

## Las nueve preguntas

Se envían **en una sola petición**. Jev las evalúa en paralelo contra el mismo
estado, así que añadir preguntas apenas cambia el tiempo de respuesta.

| Pregunta | Tipo | Devuelve |
|---|---|---|
| `required_capability` | `choice` | El servicio hospitalario que necesita + probabilidades + confianza |
| `patient_unresponsive` | `noul` | 0–1 |
| `airway_or_breathing_compromised` | `noul` | 0–1 |
| `severe_bleeding` | `noul` | 0–1 |
| `stroke_signs` | `noul` | 0–1 |
| `cardiac_chest_pain` | `noul` | 0–1 |
| `high_energy_trauma` | `noul` | 0–1 |
| `patient_is_child` | `noul` | 0–1 |
| `needs_medicalized_unit` | `noul` | 0–1 |

Las respuestas `noul` **no traen confianza propia**: son otra pregunta y se
leen con su propio umbral.

## Por qué NO se pregunta la prioridad

Se midió. Una pregunta compuesta *"¿qué tan urgente es?"* devolvía:

| Caso | Confianza |
|---|---|
| ACV clásico | 0,48 |
| Trauma mayor | 0,51 |
| Lesión leve | 0,54 |

Descompuesta en banderas atómicas, las mismas llamadas dan:

| Caso | Bandera | Valor |
|---|---|---|
| ACV clásico | `stroke_signs` | **0,98** |
| Infarto | `cardiac_chest_pain` | **0,97** |
| Trauma mayor | `high_energy_trauma` | **0,96** |
| Lesión leve | todas | **≤ 0,04** |

Es lo que dice la documentación: *si la pregunta requiere ponderar factores
independientes, descomponla y combina en código*.

## Por qué las preguntas están en inglés

Es el idioma principal de entrenamiento de Jev y donde la precisión es mejor
(<https://docs.typesafe.ai/models#language-support>). Medido en este proyecto,
un caso ambiguo pasó de 0,73 a 0,96 de confianza al traducir las preguntas. La
llamada y toda la interfaz siguen en español.

## Coste y latencia

`jev-1.13.0` cobra **0,042 USD por millón de tokens** y **solo tokens de
entrada**. Una evaluación ronda los 1.075 tokens: **$0,000045**, en 200–750 ms.

## Límites conocidos que condicionan el diseño

De <https://docs.typesafe.ai/model-jaggedness/jev-1.13>:

- **No compara fechas ni hace aritmética.** Por eso el `state` no lleva tiempos
  ni minutos transcurridos: todo lo temporal se calcula en código.
- **No hay invariantes entre preguntas.** Un umbral calibrado sobre un noul no
  se traslada a un choice.
- **El `state` es un dato, no una instrucción.** El texto de la llamada viaja
  como un campo del objeto, nunca concatenado en las instrucciones, y los
  `criteria` son explícitos para acotarlo.

## Si Jev falla

El SDK reintenta con backoff. Si aun así falla, `assess()` **no lanza**:
devuelve un resultado sin banderas y sin confianza, lo que hace que el
protocolo mande el caso a **revisión humana**. La emergencia ya está
persistida, así que no se pierde nada.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `jev.service.ts` | Llama a System One, mide latencia, calcula coste y normaliza. |
| `constants/triage-questions.constant.ts` | Las nueve preguntas. |
| `constants/triage-thresholds.constant.ts` | Umbrales y precio por token. |
| `interfaces/triage-state.interface.ts` | Lo que viaja a Jev. |
| `interfaces/triage-assessment.interface.ts` | Resultado normalizado. |

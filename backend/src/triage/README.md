# `triage/` — el protocolo que calcula la prioridad

## Para qué sirve

Convierte las banderas rojas que devuelve Jev en una prioridad de triaje.

**Jev no decide la prioridad. Este módulo sí.**

## Por qué está separado

Se midió. Preguntarle directamente a Jev *"¿qué tan urgente es?"* daba
confianzas de **0,48–0,54** incluso en casos de libro — un ACV clásico, un
trauma mayor — porque la urgencia pesa varios factores independientes a la vez.

Descompuesta en banderas atómicas, cada respuesta sube a **0,90–0,99**. La
documentación lo dice: *si la pregunta requiere ponderar factores
independientes, descomponla y combina en código*
(<https://docs.typesafe.ai/introduction#atomic-questions-composed-in-code>).

## Las reglas

En `constants/triage-protocol.constant.ts`, **en orden**; gana la primera que
dispara:

| Regla | Condición | Prioridad |
|---|---|---|
| `R1_VIA_AEREA` | Vía aérea o respiración comprometida | Crítica |
| `R2_NO_RESPONDE` | El paciente no responde | Crítica |
| `R3_DOLOR_CARDIACO` | Dolor torácico de perfil cardíaco | Crítica |
| `R4_ACV` | Signos de ataque cerebrovascular | Crítica |
| `R5_SANGRADO` | Sangrado severo | Alta |
| `R6_TRAUMA_ALTA_ENERGIA` | Mecanismo de alta energía | Alta |
| `R7_REQUIERE_ESPECIALIDAD` | Necesita un servicio especializado | Alta |
| `R8_SIN_BANDERAS` | Nada de lo anterior | Baja |

Un paciente pediátrico **sube un nivel**, criterio conservador.

Si la confianza sobre el servicio requerido queda por debajo del suelo, el caso
va a **revisión humana** y no se despacha solo.

## Por qué en código y no en un prompt

Estas reglas se leen, se versionan, se discuten con un médico y se cambian sin
tocar el modelo. Cada emergencia guarda qué regla disparó (`R4_ACV`), así que
una decisión se puede auditar después.

## ⚠️ No es un protocolo clínico validado

Está inspirado en la lógica de sistemas como Manchester o START, pero los
umbrales y el orden se escribieron para la demostración. En un sistema real los
define personal médico y se calibran con casos reales etiquetados.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `services/triage-protocol.service.ts` | Aplica las reglas en orden. |
| `constants/triage-protocol.constant.ts` | Las reglas, colores y escalamiento. |
| `interfaces/triage.interface.ts` | Banderas, prioridad y resultado. |

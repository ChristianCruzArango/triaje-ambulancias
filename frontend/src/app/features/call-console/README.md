# `call-console/` — la consola de llamadas

## Para qué sirve

Es por donde entra una emergencia. Dos formas:

**1. Generar llamada** — el simulador elige un guion y una dirección real de
Cali al azar, y el navegador la **lee en voz alta** con `speechSynthesis`. Se
oye entrar la llamada.

**2. Micrófono** — hablás vos y la **Web Speech API** transcribe en vivo,
palabra por palabra. Gratis, sin clave, en Chrome.

## El cuadro de transcripción

Mientras dictás, el texto confirmado se ve en blanco y el provisional en gris.
Al soltar el micrófono, el texto pasa a un campo **editable**.

Eso es deliberado: **la transcripción se equivoca**, y en triaje eso es grave.
*"No puede respirar"* contra *"puede respirar"* es una palabra de diferencia y
una prioridad completamente distinta. El operador corrige antes de despachar.

Y si Jev devuelve confianza baja, el caso va a revisión humana en vez de
despacharse solo.

## Privacidad

Chrome envía el audio a servidores de Google para transcribir. Para una
demostración no importa; para pacientes reales habría que usar un modelo de
audio propio.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `components/call-console.*` | Botones, cuadro de transcripción y envío. |
| `services/speech-recognition.service.ts` | Transcripción en vivo. |
| `services/speech-synthesis.service.ts` | Lee las llamadas en voz alta. |
| `constants/speech.constant.ts` | Idioma, velocidad y textos. |

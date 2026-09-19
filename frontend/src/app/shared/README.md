# `shared/` — utilidades transversales

| Archivo | Para qué |
|---|---|
| `pipes/cost.pipe.ts` | Formatea costes en USD con los decimales necesarios. |

## Por qué existe `CostPipe`

Una evaluación de Jev cuesta unos **0,000025 USD**. Con el formato de moneda
normal (dos decimales) todo saldría `$0.00` y la cifra dejaría de significar
algo. El pipe escala los decimales según la magnitud: 8 para valores muy
pequeños, 6 para intermedios, 4 para totales.

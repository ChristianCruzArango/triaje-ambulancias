/**
 * Guiones de llamada de demostración.
 *
 * ⚠️ Cada guion es ficticio. No describen personas reales y no contienen
 * nombres, teléfonos ni datos personales.
 *
 * Están escritos como habla la gente de verdad al llamar a una línea de
 * emergencias: incompletos, con ruido, a veces sin la información clave. Eso
 * es a propósito — es lo que hace difícil el triaje y lo que justifica usar
 * Jev en vez de palabras clave.
 *
 * `expected` es solo para poder revisar aciertos durante el desarrollo; el
 * sistema NUNCA lo usa para decidir.
 */
export interface CallScript {
  text: string;
  /** Referencia de desarrollo, no se usa en la decisión. */
  expected: string;
}

export const CALL_SCRIPTS: CallScript[] = [
  { text: 'Mi mamá de 70 años se desplomó, habla raro y no mueve el brazo izquierdo, empezó hace como 20 minutos', expected: 'unidad_acv' },
  { text: 'Un señor aquí en la esquina se agarró el pecho y se sentó en el andén, está pálido y sudando mucho', expected: 'hemodinamia' },
  { text: 'Mi papá se está ahogando, no responde y está morado, por favor rápido', expected: 'critica / vía aérea' },
  { text: 'Hubo un choque de moto contra un carro, el muchacho está tirado en el pavimento y sangra mucho de la pierna', expected: 'trauma_mayor' },
  { text: 'Mi hijo de 4 años se volteó la olla del agua hirviendo encima, tiene todo el pecho rojo y no para de llorar', expected: 'quemados + pediatría' },
  { text: 'Mi esposa está de 38 semanas, rompió fuente y ya tiene contracciones cada tres minutos', expected: 'obstetricia' },
  { text: 'Una señora se cayó de las escaleras del segundo piso, está consciente pero no puede mover las piernas', expected: 'trauma_mayor' },
  { text: 'Mi abuelo tiene la boca torcida y no puede hablar bien desde hace un rato', expected: 'unidad_acv' },
  { text: 'Hay un muchacho tirado en el parque, la gente dice que se desmayó, no sé si respira', expected: 'crítica / no responde' },
  { text: 'Me corté la mano con un vidrio, sangra pero ya me puse un trapo', expected: 'baja' },
  { text: 'Mi vecina no se siente bien, está rara, no sé qué le pasa', expected: 'indeterminado' },
  { text: 'Se incendió una cocina, hay un hombre con quemaduras en los brazos y la cara', expected: 'quemados' },
  { text: 'Un bebé de meses no para de llorar y está caliente, la mamá dice que respira raro', expected: 'pediatría' },
  { text: 'Atracaron a un señor y lo apuñalaron en el abdomen, está en el suelo', expected: 'trauma_mayor' },
  { text: 'Me torcí el tobillo jugando fútbol, me duele pero puedo caminar', expected: 'baja' },
];

/** Cuántas llamadas simultáneas como máximo, para no saturar la demostración. */
export const MAX_ACTIVE_EMERGENCIES = 12;

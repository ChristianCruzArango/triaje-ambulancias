import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea costes en USD.
 *
 * Una evaluación de Jev cuesta ~0,000045 USD. Con dos decimales todo sale
 * `$0.00` y la cifra deja de significar nada.
 */
@Pipe({ name: 'cost' })
export class CostPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '—';
    if (value === 0) return '$0';
    if (value < 0.0001) return `$${value.toFixed(8)}`;
    if (value < 0.01) return `$${value.toFixed(6)}`;
    return `$${value.toFixed(4)}`;
  }
}

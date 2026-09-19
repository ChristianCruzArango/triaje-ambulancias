import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Generador aleatorio con semilla opcional (`SIMULATOR_SEED`).
 *
 * Con semilla fija, una demostración se puede repetir exactamente igual para
 * depurarla. Sin semilla, usa Math.random.
 *
 * Algoritmo: mulberry32. No es criptográfico y no debe usarse para nada que
 * requiera seguridad; aquí solo elige rutas y textos de demostración.
 */
@Injectable()
export class RandomService {
  private readonly generator: () => number;
  readonly seeded: boolean;

  constructor(config: ConfigService) {
    const seed = config.get<string>('simulator.seed');
    this.seeded = Boolean(seed);
    this.generator = seed ? RandomService.mulberry32(RandomService.hash(seed)) : Math.random;
  }

  next(): number {
    return this.generator();
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  /** Elige por peso. Los pesos no necesitan sumar 1. */
  pickWeighted<T extends { weight: number }>(items: readonly T[]): T {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let roll = this.next() * total;
    for (const item of items) {
      roll -= item.weight;
      if (roll <= 0) return item;
    }
    return items[items.length - 1];
  }

  private static hash(text: string): number {
    let h = 1779033703 ^ text.length;
    for (let i = 0; i < text.length; i++) {
      h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }

  private static mulberry32(seed: number): () => number {
    let a = seed;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
}

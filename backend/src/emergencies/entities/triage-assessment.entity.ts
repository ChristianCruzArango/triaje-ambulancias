import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Emergency } from './emergency.entity.js';

/** Lo que respondió Jev, con la trazabilidad completa de la llamada. */
@Entity('triage_assessments')
export class TriageAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Clave de idempotencia: una emergencia, una evaluación. */
  @Column({ name: 'emergency_id', type: 'uuid', unique: true })
  emergencyId: string;

  @OneToOne(() => Emergency, (e) => e.assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'emergency_id' })
  emergency: Relation<Emergency>;

  /** Versión concreta que respondió, p. ej. `jev-1.13.0`. */
  @Column({ type: 'varchar', length: 80 })
  model: string;

  @Column({ name: 'required_capability', type: 'varchar', length: 40 })
  requiredCapability: string;

  @Column({ name: 'capability_probabilities', type: 'jsonb', nullable: true })
  capabilityProbabilities: Record<string, number> | null;

  @Column({ name: 'capability_confidence', type: 'double precision', nullable: true })
  capabilityConfidence: number | null;

  /** Las ocho banderas rojas, cada una 0–1. */
  @Column({ type: 'jsonb' })
  flags: Record<string, number>;

  // ── Observabilidad ──

  /** El JSON exacto enviado a Jev. */
  @Column({ name: 'sent_state', type: 'jsonb', nullable: true })
  sentState: unknown | null;

  /** Las nueve preguntas exactas enviadas. */
  @Column({ name: 'sent_questions', type: 'jsonb', nullable: true })
  sentQuestions: unknown | null;

  /** La respuesta JSON tal cual la devolvió Jev. Para poder auditarla. */
  @Column({ name: 'raw_response', type: 'jsonb', nullable: true })
  rawResponse: unknown | null;

  @Column({ name: 'latency_ms', type: 'integer', nullable: true })
  latencyMs: number | null;

  @Column({ name: 'input_tokens', type: 'integer', nullable: true })
  inputTokens: number | null;

  @Column({ name: 'output_tokens', type: 'integer', nullable: true })
  outputTokens: number | null;

  @Column({ name: 'cost_usd', type: 'double precision', nullable: true })
  costUsd: number | null;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { EmergencyStatus } from '../interfaces/emergency-status.enum.js';
import { TriageAssessment } from './triage-assessment.entity.js';

@Entity('emergencies')
export class Emergency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'call_code', type: 'varchar', length: 40 })
  callCode: string;

  // ── La llamada ──

  /** Texto transcrito o escrito. Dato fuente, nunca generado por IA. */
  @Column({ name: 'report_text', type: 'text' })
  reportText: string;

  /** `voz` o `formulario`. */
  @Column({ type: 'varchar', length: 20, default: 'voz' })
  source: string;

  @Column({ name: 'address_label', type: 'varchar', length: 160 })
  addressLabel: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  // ── Resultado del protocolo (lo calcula el código, no el modelo) ──

  @Index()
  @Column({ type: 'enum', enum: EmergencyStatus, default: EmergencyStatus.RECIBIDA })
  status: EmergencyStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  priority: string | null;

  /** Identificador de la regla del protocolo que disparó. Auditable. */
  @Column({ name: 'rule_fired', type: 'varchar', length: 40, nullable: true })
  ruleFired: string | null;

  @Column({ type: 'text', nullable: true })
  rationale: string | null;

  // ── Despacho ──

  @Column({ name: 'ambulance_code', type: 'varchar', length: 20, nullable: true })
  ambulanceCode: string | null;

  @Column({ name: 'hospital_code', type: 'varchar', length: 40, nullable: true })
  hospitalCode: string | null;

  @Column({ name: 'hospital_distance_km', type: 'double precision', nullable: true })
  hospitalDistanceKm: number | null;

  /**
   * El hospital más cercano cuando NO fue el elegido, y por qué se descartó.
   * Es la evidencia visible de para qué sirve Jev.
   */
  @Column({ name: 'nearest_overruled', type: 'jsonb', nullable: true })
  nearestOverruled: unknown | null;

  /** Todos los hospitales evaluados y por qué se descartó cada uno. */
  @Column({ name: 'hospital_candidates', type: 'jsonb', nullable: true })
  hospitalCandidates: unknown | null;

  @Column({ name: 'dispatch_latency_ms', type: 'integer', nullable: true })
  dispatchLatencyMs: number | null;

  @Column({ name: 'blocked_reason', type: 'text', nullable: true })
  blockedReason: string | null;

  /** `true` para datos creados por el simulador. */
  @Column({ name: 'is_demo', type: 'boolean', default: true })
  isDemo: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => TriageAssessment, (a) => a.emergency)
  assessment: Relation<TriageAssessment> | null;
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1791584688147 implements MigrationInterface {
  name = 'InitialSchema1791584688147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "triage_assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "emergency_id" uuid NOT NULL, "model" character varying(80) NOT NULL, "required_capability" character varying(40) NOT NULL, "capability_probabilities" jsonb, "capability_confidence" double precision, "flags" jsonb NOT NULL, "sent_state" jsonb, "sent_questions" jsonb, "raw_response" jsonb, "latency_ms" integer, "input_tokens" integer, "output_tokens" integer, "cost_usd" double precision, "error" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b0fffe30a5c4d4b5aa1fa9af478" UNIQUE ("emergency_id"), CONSTRAINT "REL_b0fffe30a5c4d4b5aa1fa9af47" UNIQUE ("emergency_id"), CONSTRAINT "PK_fc0083fe2498fbeeab1a90104f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."emergencies_status_enum" AS ENUM('RECIBIDA', 'TRIADA', 'DESPACHADA', 'EN_SITIO', 'TRASLADO', 'CERRADA', 'REVISION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "emergencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "call_code" character varying(40) NOT NULL, "report_text" text NOT NULL, "source" character varying(20) NOT NULL DEFAULT 'voz', "address_label" character varying(160) NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "status" "public"."emergencies_status_enum" NOT NULL DEFAULT 'RECIBIDA', "priority" character varying(20), "rule_fired" character varying(40), "rationale" text, "ambulance_code" character varying(20), "hospital_code" character varying(40), "hospital_distance_km" double precision, "nearest_overruled" jsonb, "hospital_candidates" jsonb, "dispatch_latency_ms" integer, "blocked_reason" text, "is_demo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7851897a3b7f700ac8702124aa8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b667a4ca28ff847e438f6e4320" ON "emergencies"  ("call_code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d1c1a068c72fc8d63acb440a4" ON "emergencies"  ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "triage_assessments" ADD CONSTRAINT "FK_b0fffe30a5c4d4b5aa1fa9af478" FOREIGN KEY ("emergency_id") REFERENCES "emergencies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "triage_assessments" DROP CONSTRAINT "FK_b0fffe30a5c4d4b5aa1fa9af478"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d1c1a068c72fc8d63acb440a4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b667a4ca28ff847e438f6e4320"`,
    );
    await queryRunner.query(`DROP TABLE "emergencies"`);
    await queryRunner.query(`DROP TYPE "public"."emergencies_status_enum"`);
    await queryRunner.query(`DROP TABLE "triage_assessments"`);
  }
}

import { Module } from '@nestjs/common';
import { TriageProtocolService } from './services/triage-protocol.service.js';

@Module({
  providers: [TriageProtocolService],
  exports: [TriageProtocolService],
})
export class TriageModule {}

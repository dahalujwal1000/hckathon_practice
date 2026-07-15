import { Module } from '@nestjs/common';
import { AiHttpService } from './services/aiService';

@Module({
  providers: [AiHttpService],
  exports: [AiHttpService],
})
export class SharedModule {}

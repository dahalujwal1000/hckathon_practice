import { Module } from '@nestjs/common';
import { AiHttpService } from './services/aiService';
import { EmailService } from './services/email.service';

@Module({
  providers: [AiHttpService, EmailService],
  exports: [AiHttpService, EmailService],
})
export class SharedModule {}

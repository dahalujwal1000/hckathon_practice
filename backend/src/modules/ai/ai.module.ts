import { Module } from '@nestjs/common';
import { AiController } from './controller/ai.controller';
import { AiService } from './service/ai.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
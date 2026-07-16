import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AiService } from './service/ai.service';
import { SymptomsRequestDto, SymptomsResponseDto } from './dto/symptoms.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    return this.aiService.chat(message);
  }

  @Post('symptoms')
  @UsePipes(new ValidationPipe({ transform: true }))
  async analyzeSymptoms(@Body() symptomsDto: SymptomsRequestDto): Promise<SymptomsResponseDto> {
    return this.aiService.analyzeSymptoms(symptomsDto);
  }

  @Post('recommend-doctor')
  async recommendDoctor(@Body() recommendDto: any) {
    return this.aiService.recommendDoctor(recommendDto);
  }
}
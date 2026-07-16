import { Injectable, NotFoundException } from '@nestjs/common';
import { AiHttpService } from '../../shared/services/aiService';
import { SymptomsRequestDto, SymptomsResponseDto, ConditionInfoDto } from './dto/symptoms.dto';

@Injectable()
export class AiService {
  constructor(private readonly aiHttpService: AiHttpService) {}

  async chat(message: string) {
    return this.aiHttpService.post('/chat', { message });
  }

  async analyzeSymptoms(symptomsDto: SymptomsRequestDto): Promise<SymptomsResponseDto> {
    const result = await this.aiHttpService.post('/symptoms', symptomsDto);

    // Transform response to match our DTO structure if needed
    return {
      conditions: result.conditions || [],
      recommendations: result.recommendations || [],
      urgency: result.urgency || 'low',
      suggestedCategory: result.suggestedCategory || 'general',
    };
  }

  async recommendDoctor(recommendDto: any) {
    return this.aiHttpService.post('/recommend-doctor', recommendDto);
  }
}
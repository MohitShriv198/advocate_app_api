import { Controller, Get } from '@nestjs/common';
import { SecurityQuestionsService } from './security-questions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('security-questions')
@Controller('security-questions')
export class SecurityQuestionsController {
  constructor(private securityService: SecurityQuestionsService) {}

  @Get()
  getSecurityQuestion() {
    return this.securityService.findAll();
  }
}

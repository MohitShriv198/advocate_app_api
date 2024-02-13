import { Module } from '@nestjs/common';
import { SecurityQuestionsController } from './security-questions.controller';
import { SecurityQuestionsService } from './security-questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityQuestion } from './security-question.entity';
import { HttpResponse } from 'src/httpResponse';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityQuestion])],
  controllers: [SecurityQuestionsController],
  providers: [SecurityQuestionsService,HttpResponse],
})
export class SecurityQuestionsModule {}

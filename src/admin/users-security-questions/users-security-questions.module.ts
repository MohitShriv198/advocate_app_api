import { Module } from '@nestjs/common';
import { UsersSecurityQuestionsController } from './users-security-questions.controller';
import { UsersSecurityQuestionsService } from './users-security-questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSecurityQuestion } from './user-security-question.entity';
import { HttpResponse } from 'src/httpResponse';
import { User } from 'src/users/user.entity';
import { SecurityQuestion } from '../security-questions/security-question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSecurityQuestion, User, SecurityQuestion]),
  ],
  controllers: [UsersSecurityQuestionsController],
  providers: [UsersSecurityQuestionsService, HttpResponse],
})
export class UsersSecurityQuestionsModule {}

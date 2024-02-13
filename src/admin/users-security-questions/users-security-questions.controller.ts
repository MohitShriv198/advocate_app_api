import { Body, Controller, Post } from '@nestjs/common';
import { UsersSecurityQuestionsService } from './users-security-questions.service';
import { CreateUserSecurityQuestionsDto } from './dtos/create-user-security-questions.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users-security-questions')
@Controller('users-security-questions')
export class UsersSecurityQuestionsController {
  constructor(
    private usersSecurityQuestionsService: UsersSecurityQuestionsService,
  ) {}

  @Post()
  create(@Body() body: CreateUserSecurityQuestionsDto) {
    return this.usersSecurityQuestionsService.create(body);
  }

  @Post('/checkAnswer')
  checkAnswer(@Body() body: CreateUserSecurityQuestionsDto) {
    return this.usersSecurityQuestionsService.checkAnswer(body);
  }
}

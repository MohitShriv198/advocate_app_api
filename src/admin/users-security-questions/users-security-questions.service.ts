import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSecurityQuestion } from './user-security-question.entity';
import { Repository } from 'typeorm';
import { HttpResponse } from 'src/httpResponse';
import { User } from 'src/users/user.entity';
import { SecurityQuestion } from '../security-questions/security-question.entity';
import { CreateUserSecurityQuestionsDto } from './dtos/create-user-security-questions.dto';
import {
  USER_NOT_FOUND,
  USER_SECURITY_ANSWER_INCORRECT,
} from 'src/utils/constant';

@Injectable()
export class UsersSecurityQuestionsService {
  constructor(
    @InjectRepository(UserSecurityQuestion)
    private userSecurityQuestionRepository: Repository<UserSecurityQuestion>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SecurityQuestion)
    private securityQuestionRepository: Repository<SecurityQuestion>,
    private httpResponse: HttpResponse,
  ) {}

  async create(body: CreateUserSecurityQuestionsDto) {
    try {
      for (let answer of body.userSecurityQuestions) {
        const userSecurityQuestion =
          this.userSecurityQuestionRepository.create(answer);
        const user = await this.userRepository.findOneBy({
          id: answer.userId,
        });
        if (!user) {
          return this.httpResponse.badRequest({}, USER_NOT_FOUND);
        }
        const securityQuestion =
          await this.securityQuestionRepository.findOneBy({
            id: answer.securityQuestionId,
          });
        userSecurityQuestion.user = user;
        userSecurityQuestion.securityQuestion = securityQuestion;
        this.userSecurityQuestionRepository.save(userSecurityQuestion);
      }
      return this.httpResponse.success();
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async checkAnswer(body: CreateUserSecurityQuestionsDto) {
    try {
      for (let answer of body.userSecurityQuestions) {
        const ans = await this.userSecurityQuestionRepository.findOneBy({
          user: { id: answer.userId },
          securityQuestion: { id: answer.securityQuestionId },
        });
        console.log(ans);
        if (ans.answer !== answer.answer) {
          return this.httpResponse.badRequest(
            {},
            USER_SECURITY_ANSWER_INCORRECT,
          );
        }
      }
      return this.httpResponse.success();
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }
}

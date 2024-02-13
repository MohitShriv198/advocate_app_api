import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SecurityQuestion } from './security-question.entity';
import { Repository } from 'typeorm';
import { HttpResponse } from 'src/httpResponse';

@Injectable()
export class SecurityQuestionsService {
  constructor(
    @InjectRepository(SecurityQuestion)
    private securityQuestionRepository: Repository<SecurityQuestion>,
    private httpResponse: HttpResponse,
  ) {}

  async findAll() {
    try {
      let securityQuestions = {};
      const questions_1 = await this.securityQuestionRepository.query(
        `SELECT * FROM security_question WHERE type = 1`,
      );
      const questions_2 = await this.securityQuestionRepository.query(
        `SELECT * FROM security_question WHERE type = 2`,
      );
      securityQuestions = { ...securityQuestions, questions_1, questions_2 };
      return this.httpResponse.success(securityQuestions);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }
}

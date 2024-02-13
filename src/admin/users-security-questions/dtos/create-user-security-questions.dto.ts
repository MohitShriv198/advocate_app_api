import { IsArray, ValidateNested } from 'class-validator';
import { CreateUserSecurityQuestionDto } from './create-user-security-question.dto';
import { Type } from 'class-transformer';

export class CreateUserSecurityQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserSecurityQuestionDto)
  userSecurityQuestions: CreateUserSecurityQuestionDto[];
}

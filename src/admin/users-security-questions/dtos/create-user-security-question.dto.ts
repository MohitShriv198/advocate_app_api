import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserSecurityQuestionDto {
  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  securityQuestionId: number;
}

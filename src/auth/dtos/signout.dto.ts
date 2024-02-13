import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class SignOutDto {
  @IsNumber()
  userId: number;
}

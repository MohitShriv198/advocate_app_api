import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendOtpDto {
  @IsString()
  phone_number: string;

  @IsNumber()
  userId: number;
}

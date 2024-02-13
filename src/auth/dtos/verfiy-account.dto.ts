import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class VerfiyAccountDto {
  @IsString()
  @IsOptional()
  phone_number: string;

  @IsEmail()
  @IsOptional()
  email: string;
}

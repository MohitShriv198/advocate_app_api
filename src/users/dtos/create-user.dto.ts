import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  phone_number: string;

  @IsString()
  passcode: string;
}

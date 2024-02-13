import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeDevice {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  deviceToken: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;
}

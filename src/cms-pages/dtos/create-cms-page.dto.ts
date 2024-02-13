import { IsBoolean, IsString } from 'class-validator';

export class CreateCmsPageDto {
  @IsString()
  description: string;

  @IsString()
  key: string;
}

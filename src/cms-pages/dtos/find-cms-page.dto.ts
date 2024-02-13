import { IsString } from 'class-validator';

export class FindCmsPageDto {
  @IsString()
  key: string;
}

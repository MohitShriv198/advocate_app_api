import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateCmsPageDto {
    @IsNumber()
    id: number;
    
    @IsString()
    description: string;

    @IsString()
    key: string;
}

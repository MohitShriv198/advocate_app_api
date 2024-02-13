import { IsString } from "class-validator";

export class resetPasswordDto{
    @IsString()
    oldPassword:string

    @IsString()
    newPassword:string
}
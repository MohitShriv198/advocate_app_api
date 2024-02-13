import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';

@Controller('auth-admin')
export class AuthAdminController {
    constructor(private authAdminService: AuthAdminService) { }
    @Post('/login')
    signIn(@Body() body: LoginDto) {
        return this.authAdminService.signIn(body.email, body.password);
    }

    @Patch('/change-password')
    resetPassword(@Body() body: ChangePasswordDto) {
        return this.authAdminService.changePassword(body.email, body.currentPassword, body.newPassword);
    }
}

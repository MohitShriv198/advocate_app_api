import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { HttpResponse } from 'src/httpResponse';

@Module({
  imports: [TypeOrmModule.forFeature([User]),UsersModule],
    controllers:[AuthAdminController],
    providers:[AuthAdminService, HttpResponse]
})
export class AuthAdminModule {}

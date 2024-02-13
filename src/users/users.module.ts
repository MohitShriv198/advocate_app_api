import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { HttpResponse } from 'src/httpResponse';
// import { FcmNotificationModule } from 'src/fcm-notification/fcm-notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, HttpResponse],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { UserInfoController } from './user-info.controller';
import { UserInfo } from './user-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo])],
  providers: [UserInfoService],
  controllers: [UserInfoController]
})
export class UserInfoModule {}

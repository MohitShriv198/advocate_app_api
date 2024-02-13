import { Module } from '@nestjs/common';
import { CmsPagesController } from './cms-pages.controller';
import { CmsPagesService } from './cms-pages.service';
import { HttpResponse } from 'src/httpResponse';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsPage } from './cms-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CmsPage])],
  controllers: [CmsPagesController],
  providers: [CmsPagesService, HttpResponse],
})
export class CmsPagesModule {}

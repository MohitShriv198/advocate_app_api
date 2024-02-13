import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateCmsPageDto } from './dtos/create-cms-page.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindCmsPageDto } from './dtos/find-cms-page.dto';
import { CmsPagesService } from './cms-pages.service';
import { UpdateCmsPageDto } from './dtos/update-cms-page.dto';

@ApiTags('cms-pages')
@Controller('cms-pages')
export class CmsPagesController {
  constructor(private cmsPageService: CmsPagesService) {}

  @Post()
  create(@Body() body: CreateCmsPageDto) {
    return this.cmsPageService.create(body);
  }

  @Get()
  findByKey(@Body() body: FindCmsPageDto) {
    return this.cmsPageService.findBykey(body.key);
  }

  @Patch()
  update(@Body() body: UpdateCmsPageDto) {
    return this.cmsPageService.update(body);
  }

  @Delete()
  delete(id:number){
    return this.cmsPageService.delete(id);
  }
}

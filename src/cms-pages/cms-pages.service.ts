import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CmsPage } from './cms-page.entity';
import { Repository } from 'typeorm';
import { HttpResponse } from 'src/httpResponse';
import { DELETE_SUCCESS, PAGE_NOT_FOUND, UPDATE_SUCCESS } from 'src/utils/constant';
import { CreateCmsPageDto } from './dtos/create-cms-page.dto';
import { UpdateCmsPageDto } from './dtos/update-cms-page.dto';

@Injectable()
export class CmsPagesService {
  constructor(
    @InjectRepository(CmsPage) private cmsPageRepository: Repository<CmsPage>,
    private httpResponse: HttpResponse,
  ) { }

  async create(body: CreateCmsPageDto) {
    try {
      let cmsPage = this.cmsPageRepository.create(body);
      await this.cmsPageRepository.save(cmsPage);
      return this.httpResponse.success(cmsPage);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async findBykey(key: string) {
    try {
      const page = await this.cmsPageRepository.findOneBy({ key });
      if (!page) {
        return this.httpResponse.badRequest({}, PAGE_NOT_FOUND);
      }
      return this.httpResponse.success(page);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async update(body: UpdateCmsPageDto) {
    try {
      const cmsPage = await this.cmsPageRepository.update(body.id, body);
      return this.httpResponse.success(cmsPage, UPDATE_SUCCESS);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.cmsPageRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`CmsPage with ID ${id} not found.`);
      }
      return this.httpResponse.success(null, DELETE_SUCCESS);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

}

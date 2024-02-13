import { Test, TestingModule } from '@nestjs/testing';
import { CmsPagesController } from './cms-pages.controller';

describe('CmsPagesController', () => {
  let controller: CmsPagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmsPagesController],
    }).compile();

    controller = module.get<CmsPagesController>(CmsPagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

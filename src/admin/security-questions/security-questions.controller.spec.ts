import { Test, TestingModule } from '@nestjs/testing';
import { SecurityQuestionsController } from './security-questions.controller';

describe('SecurityQuestionsController', () => {
  let controller: SecurityQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityQuestionsController],
    }).compile();

    controller = module.get<SecurityQuestionsController>(SecurityQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

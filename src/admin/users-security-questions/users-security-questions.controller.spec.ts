import { Test, TestingModule } from '@nestjs/testing';
import { UsersSecurityQuestionsController } from './users-security-questions.controller';

describe('UsersSecurityQuestionsController', () => {
  let controller: UsersSecurityQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersSecurityQuestionsController],
    }).compile();

    controller = module.get<UsersSecurityQuestionsController>(UsersSecurityQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

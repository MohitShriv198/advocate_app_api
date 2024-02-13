import { Test, TestingModule } from '@nestjs/testing';
import { UsersSecurityQuestionsService } from './users-security-questions.service';

describe('UsersSecurityQuestionsService', () => {
  let service: UsersSecurityQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersSecurityQuestionsService],
    }).compile();

    service = module.get<UsersSecurityQuestionsService>(UsersSecurityQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

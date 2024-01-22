import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorAutenticateService } from './two-factor-autenticate.service';

describe('TwoFactorAutenticateService', () => {
  let service: TwoFactorAutenticateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFactorAutenticateService],
    }).compile();

    service = module.get<TwoFactorAutenticateService>(TwoFactorAutenticateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MiddlewareConfigService } from './middleware-config.service';

describe('MiddlewareConfigService', () => {
  let service: MiddlewareConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MiddlewareConfigService],
    }).compile();

    service = module.get<MiddlewareConfigService>(MiddlewareConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

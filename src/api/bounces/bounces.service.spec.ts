import { Test, TestingModule } from '@nestjs/testing';
import { BouncesService } from './bounces.service';

describe('BouncesService', () => {
  let service: BouncesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BouncesService],
    }).compile();

    service = module.get<BouncesService>(BouncesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

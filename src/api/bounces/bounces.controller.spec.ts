import { Test, TestingModule } from '@nestjs/testing';
import { BouncesController } from './bounces.controller';
import { BouncesService } from './bounces.service';

describe('BouncesController', () => {
  let controller: BouncesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BouncesController],
      providers: [BouncesService],
    }).compile();

    controller = module.get<BouncesController>(BouncesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

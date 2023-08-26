import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorsController } from './administrators.controller';
import { AdministratorsService } from './administrators.service';

describe('AdministratorsController', () => {
  let controller: AdministratorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministratorsController],
      providers: [AdministratorsService],
    }).compile();

    controller = module.get<AdministratorsController>(AdministratorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

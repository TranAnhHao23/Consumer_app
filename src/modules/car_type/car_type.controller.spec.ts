import { Test, TestingModule } from '@nestjs/testing';
import { CarTypeController } from './car_type.controller';
import { CarTypeService } from './car_type.service';

describe('CarTypeController', () => {
  let controller: CarTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarTypeController],
      providers: [CarTypeService],
    }).compile();

    controller = module.get<CarTypeController>(CarTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

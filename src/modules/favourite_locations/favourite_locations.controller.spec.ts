import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteLocationsController } from './favourite_locations.controller';
import { FavouriteLocationsService } from './favourite_locations.service';

describe('FavouriteLocationsController', () => {
  let controller: FavouriteLocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouriteLocationsController],
      providers: [FavouriteLocationsService],
    }).compile();

    controller = module.get<FavouriteLocationsController>(FavouriteLocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

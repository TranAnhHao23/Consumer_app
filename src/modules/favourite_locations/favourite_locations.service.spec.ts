import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteLocationsService } from './favourite_locations.service';

describe('FavouriteLocationsService', () => {
  let service: FavouriteLocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavouriteLocationsService],
    }).compile();

    service = module.get<FavouriteLocationsService>(FavouriteLocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

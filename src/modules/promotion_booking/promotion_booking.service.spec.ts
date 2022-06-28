import { Test, TestingModule } from '@nestjs/testing';
import { PromotionBookingService } from './promotion_booking.service';

describe('PromotionBookingService', () => {
  let service: PromotionBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionBookingService],
    }).compile();

    service = module.get<PromotionBookingService>(PromotionBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

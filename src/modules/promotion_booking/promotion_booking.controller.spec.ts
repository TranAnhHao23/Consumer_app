import { Test, TestingModule } from '@nestjs/testing';
import { PromotionBookingController } from './promotion_booking.controller';
import { PromotionBookingService } from './promotion_booking.service';

describe('PromotionBookingController', () => {
  let controller: PromotionBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionBookingController],
      providers: [PromotionBookingService],
    }).compile();

    controller = module.get<PromotionBookingController>(PromotionBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

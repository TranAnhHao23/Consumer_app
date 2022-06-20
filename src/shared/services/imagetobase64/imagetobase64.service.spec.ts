import { Test, TestingModule } from '@nestjs/testing';
import { Imagetobase64Service } from './imagetobase64.service';

describe('Imagetobase64Service', () => {
  let service: Imagetobase64Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Imagetobase64Service],
    }).compile();

    service = module.get<Imagetobase64Service>(Imagetobase64Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { Imagetobase64Service } from './services/imagetobase64/imagetobase64.service';

@Module({
  providers: [Imagetobase64Service],
  exports: [Imagetobase64Service],
})
export class SharedModule {}

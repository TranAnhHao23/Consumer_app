import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from './entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    DriverEntity
  ])], 
  controllers: [DriverController],
  providers: [DriverService]
})
export class DriverModule {}

import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    CarEntity
  ])],
  controllers: [CarController],
  providers: [CarService]
})
export class CarModule {}

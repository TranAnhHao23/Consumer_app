import { Module } from '@nestjs/common';
import { GuestProfileService } from './guest_profile.service';
import { GuestProfileController } from './guest_profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from '../device/entities/device.entity';
import { GuestProfileEntity } from './entities/guest_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, GuestProfileEntity])],
  controllers: [GuestProfileController],
  providers: [GuestProfileService],
})
export class GuestProfileModule {}

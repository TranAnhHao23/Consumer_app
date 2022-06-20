import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressProfileEntity } from '../address_profile/entities/address_profile.entity';
import { DeviceEntity } from '../device/entities/device.entity';
import { UserSessionEntity } from '../user_session/entities/user_session.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AddressProfileEntity,
      UserSessionEntity,
      DeviceEntity,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

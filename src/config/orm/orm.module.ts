import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { DeviceEntity } from '../../modules/device/entities/device.entity';
import { AddressProfileEntity } from 'src/modules/address_profile/entities/address_profile.entity';
import { GuestProfileEntity } from 'src/modules/guest_profile/entities/guest_profile.entity';
import { UserSessionEntity } from 'src/modules/user_session/entities/user_session.entity';
// const entities = [Users];
// const entities = [__dirname + '/**/entity/*.entity{.ts,.js}'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        DeviceEntity,
        AddressProfileEntity,
        GuestProfileEntity,
        UserSessionEntity,
      ],
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class ORMModule {}

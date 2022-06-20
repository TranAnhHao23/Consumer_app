import { Module } from '@nestjs/common';
import { UserSessionService } from './user_session.service';
import { UserSessionController } from './user_session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionEntity } from './entities/user_session.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSessionEntity])],
  controllers: [UserSessionController],
  providers: [UserSessionService],
  exports: [UserSessionService],
})
export class UserSessionModule {}

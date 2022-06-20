import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSessionEntity } from './entities/user_session.entity';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSessionEntity)
    private readonly userSessionRepository: Repository<UserSessionEntity>,
  ) {}
  async createUserSession(userSessionData: any) {
    const userSession = this.userSessionRepository.create(userSessionData);
    return await this.userSessionRepository.save(userSession);
  }

  async update(user_id: string, userSessionData: any) {
    const userSession = await this.userSessionRepository.findOne({
      where: { user_id: user_id },
    });
    await this.userSessionRepository.update(
      { id: userSession.id },
      userSessionData,
    );
  }

  async findAll() {
    return `This action returns all userSession`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} userSession`;
  }

  async remove(id: number) {
    return `This action removes a #${id} userSession`;
  }
}

import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { from, Observable } from 'rxjs';
import { UserDto } from './dto/user.dto';
import { AuthLoginMobileDto } from '../auth/dto/auth-login-mobile.dto';
import { AuthLoginDto } from '../auth/dto/auth-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /* use Promise */
  // createPost(user: CreateUserDto): Promise<CreateUserDto> {
  //   return this.userRepository.save(user);
  // }

  /* use Observable */

  /* from : Turn an array, promise, or iterable into an observable. */
  async createUser(data: Partial<CreateUserDto>): Promise<any> {
    const user = await this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findAllUsers() {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponseObject(false));
  }

  async updateUser(
    user_id: string,
    user: Partial<UserDto>,
  ): Promise<CreateUserDto> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.userRepository.update({ id: user_id }, user);
    return this.userRepository.findOne({ id: user_id });
  }

  async findById(id: string): Promise<any> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByRbhUserId(@Param('rbhUserId') rbhUserId: string): Promise<any> {
    return await this.userRepository.findOne({
      where: { rbhUserId: rbhUserId },
    });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByMobile(mobileNo: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { mobileNo } });
  }

  async deleteByEmail(email: string): Promise<any> {
    await this.userRepository.delete({ email: email });
    return { deleted: true };
  }

  async deleteUser(id: string): Promise<any> {
    await this.userRepository.delete({ id: id });
    return { deleted: true };
  }
}

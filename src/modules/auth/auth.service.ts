import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserDto } from '../user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { AddressProfileEntity } from '../address_profile/entities/address_profile.entity';
import { AuthLoginMobileDto } from './dto/auth-login-mobile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AddressProfileEntity)
    private readonly addressProfileEntity: Repository<AddressProfileEntity>,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginAccountByEmail(data: AuthLoginDto): Promise<any> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    // if user doesn’t exist then Hard stop and return resultCode = 1899 (Failed)
    if (!user) {
      return {
        resultCode: 1899,
        status: 'Error',
        errorMessage: 'Information not available, please try again later.',
        data: {},
      };
      // throw new HttpException('user doesn’t exist', HttpStatus.BAD_REQUEST);
    }
    // Validate user password by encrypt password with Encrypt with AES256 CBC and add salt from user profile
    // if password is not match then Hard stop and return resultCode = 1555
    if (!(await user.validatePassword(password))) {
      return {
        resultCode: 1555,
        status: 'Error',
        errorMessage: 'This password is not match. Please try again.',
        data: {},
      };
    }
    //if all success, update  user_session then return resultCode = 1000 (Success)
    // const userSession = await this.userSessionRepository.findOne({ where: { user_id } });
    const payload = { email: user.email, sub: user.id };

    return {
      resultCode: 1000,
      status: 'SUCCESSFUL',
      errorMessage: 'SUCCESS',
      data: {
        userId: user.id,
        access_token: this.jwtService.sign(payload),
      },
    };
  }

  logout(req, res) {
    req.session.cookie.maxAge = 0;
    req.logOut();
    return res.sendStatus(401);
  }

  async registerBusiness(data: UserDto): Promise<any> {
    const { email } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const new_user = await this.userRepository.create(data);
    await this.userRepository.save(new_user);
    return new_user.toResponseObject();
  }

  async registerPersonal(data: any): Promise<any> {
    const { email } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    // create address
    const new_address = await this.addressProfileEntity.create({
      address: data.address,
    });
    const address = await this.addressProfileEntity.save(new_address);

    const new_user = await this.userRepository.create({
      ...data,
      address: address.id,
    });
    await this.userRepository.save(new_user);

    // // CREATE USER SESSION
    // new_user.id,
    //   let new_user_session = await this.userRepository.create({...data, address: address.id});
    // await this.userRepository.save(new_user);

    // return new_user.toResponseObject();
  }
}

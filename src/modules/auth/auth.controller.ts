import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UserService } from '../user/user.service';
import { AuthLoginMobileDto } from './dto/auth-login-mobile.dto';
import { HttpService } from '@nestjs/axios';
import { AuthLoginOptMobileValidationDto } from './dto/auth-login-opt-mobile-validation.dto';
import { UserSessionService } from '../user_session/user_session.service';
import { DeviceService } from '../device/device.service';
import { MobileValidationDto } from './dto/mobile-validation.dto';
import { RegistrationOtpMobileDto } from './dto/registration-otp-mobile.dto';
import { RegistrationOtpMobileValidationDto } from './dto/registration-otp-mobile-validation.dto';
import { BaseError } from '../../shared/base-error';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // constructor(
  //   private readonly authService: AuthService,
  //   private readonly userService: UserService,
  //   private readonly userSessionService: UserSessionService,
  //   private readonly deviceService: DeviceService,
  //   private httpService: HttpService,
  // ) {
  // }

  // @Post('onboarding/mobile/validation')
  // async mobileValidation(@Body() dataUser: MobileValidationDto): Promise<any> {
  //   // call API to /v1/authentication/mobile/validation
  //   // let response = await this.httpService.post('/v1/authentication/mobile/validation', { param }).toPromise();
  //   const response = {
  //     status: {
  //       code: 1000,
  //       header: 'SUCCESS',
  //       description: '',
  //     },
  //     data: {
  //       userId: 'u123ad2234',
  //       firstName: 'TestName',
  //       lastName: 'TestLastName',
  //       idToken: null,
  //       accessToken: 'xxxxxxxxxxxxxx',
  //       refreshToken: 'xxxxxxxxxxxxxx',
  //       customToken: 'xxxxxxxxxxxxxx',
  //       pageType: 'NEW_USER',
  //     },
  //   };

  //   if (response.data.pageType === 'EXISTING_USER') {
  //     const rbhUserId = response.data.userId;
  //     let user = await this.userService.findByRbhUserId(rbhUserId);
  //     if (!user) {
  //       user = this.userService.createUser(dataUser);
  //     }
  //     let user_session = await this.userService.findByRbhUserId(user.id);
  //     if (user_session) {
  //       const userSessionData = {
  //         user_id: user.id,
  //         token: response.data.accessToken,
  //       };
  //       user_session = await this.userSessionService.createUserSession(
  //         userSessionData,
  //       );
  //     } else {
  //       user_session = await this.userSessionService.update(
  //         user.id,
  //         response.data.accessToken,
  //       );
  //     }

  //     return {
  //       resultCode: '1000',
  //       status: 'SUCCESSFUL',
  //       errorMessage: 'SUCCESS',
  //       data: {
  //         userId: user.id,
  //         userSessionId: user_session.id,
  //         token: user_session.token,
  //         userType: 'EXISTING_USER',
  //       },
  //     };
  //   } else {
  //     return {
  //       resultCode: '1002',
  //       status: 'SUCCESSFUL',
  //       errorMessage: 'SUCCESS',
  //       data: {
  //         userType: 'NEW_USER',
  //       },
  //     };
  //   }
  // }

  // @Post('onboarding/registration/otp/mobile')
  // async otpMobile(@Body() param: RegistrationOtpMobileDto): Promise<any> {
  //   // let response = await this.httpService.post('/v1/authentication/otp/mobile', { param.mobileNo }).toPromise();
  //   const response = {
  //     status: {
  //       code: 1000,
  //       header: 'SUCCESS',
  //       description: '',
  //     },
  //     data: {
  //       refToken: 'xxxxxxxxxxxx',
  //       tokenUUID: 'xxxxxxx',
  //       expireDateTime: '2020-06-13T18:35:25.000Z',
  //       issueDateTime: '2020-06-13T14:35:25.000Z',
  //       validDuration: 120,
  //     },
  //   };
  //   if (response.data.validDuration < 30) {
  //     throw BaseError.OTP_EXPIRED();
  //   }
  //   return {
  //     resultCode: '1000',
  //     status: 'SUCCESSFUL',
  //     errorMessage: 'SUCCESS',
  //     data: response.data,
  //   };
  // }

  // @Post('onboarding/registration/otp/mobile/validation')
  // async otpMobileValidation(
  //   @Body() param: RegistrationOtpMobileValidationDto,
  // ): Promise<any> {
  //   // const response = await this.httpService.post('/v1/authentication/otp/mobile/validation',
  //   // { tokenUUID: param.otp.tokenUUID, otpCode: param.otp.otpCode, refToken: param.otp.refToken }).toPromise();
  //   const token = 'null';

  //   const response = {
  //     status: {
  //       code: 1000,
  //       header: 'SUCCESS',
  //       description: '',
  //     },
  //     data: {
  //       refToken: 'xxxxxxxxxxxx',
  //       remainTimes: 2,
  //       tokenId: 'xxxxxxxxxx',
  //       scope: 'ONBOARD',
  //     },
  //   };
  //   if (response.status.code == 1899) {
  //     throw BaseError.INFO_NOT_AVAILABLE;
  //   }

  //   if (response.status.code === 1999) {
  //     throw BaseError.OTP_EXPIRED();
  //   }

  //   if (response.status.code === 3013) {
  //     throw BaseError.OTP_FAIL();
  //   }

  //   if (response.status.code === 3014) {
  //     throw BaseError.OTP_EXPIRE();
  //   }

  //   if (response.status.code === 3015) {
  //     throw BaseError.OTP_NOT_VALID();
  //   }

  //   if (response.status.code === 3012) {
  //     throw BaseError.PHONE_BLOCKED();
  //   }

  //   const existUserByMobile = await this.userService.findByMobile(param.user.mobileNo);
  //   if (existUserByMobile) {
  //     throw BaseError.MOBILE_EXIST();
  //   }
  //   const existUserByEmail = await this.userService.findByEmail(param.user.email);
  //   if (existUserByEmail) {
  //     throw BaseError.EMAIL_EXIST();
  //   }

  //   if (param.registrationMode === 'PERSONAL') {
  //     const new_user = await this.userService.createUser(param.user);
  //     //save data for new session
  //     const userSessionData = {
  //       user: new_user.id,
  //       token: null,
  //     };

  //     const userId = new_user.id;
  //     await this.userSessionService.createUserSession(userSessionData);
  //     await this.deviceService.createDevice(userId);

  //     return {
  //       resultCode: '1000',
  //       status: 'SUCCESSFUL',
  //       errorMessage: 'SUCCESS',
  //       data: new_user,
  //     };

  //   }

  //   if (param.registrationMode === 'BUSINESS') {
  //     const new_user = await this.userService.createUser(param.user);
  //     console.log(new_user, 'new_user');
  //     //save data for new session
  //     const userSessionData = {
  //       user: new_user.id,
  //       token: null,
  //     };

  //     const userId = new_user.id;
  //     await this.userSessionService.createUserSession(userSessionData);
  //     await this.deviceService.createDevice(userId);

  //     const dataBussiness = {
  //       ...param.user,
  //       tel: param.user.mobileNo,
  //       name: param.business.name,
  //       typeId: param.business.typeId,
  //     }

  //     return {
  //       resultCode: '1000',
  //       status: 'SUCCESSFUL',
  //       errorMessage: 'SUCCESS',
  //       data: dataBussiness,
  //     };

  //   }
  // }

  // @Post('onboarding/login/email/validation')
  // @UsePipes(new ValidationPipe())
  // loginEmail(@Body() data: AuthLoginDto) {
  //   return this.authService.loginAccountByEmail(data);
  // }

  // // @Body() user: UserDto,
  // @Post('onboarding/login/otp/mobile')
  // @UsePipes(new ValidationPipe())
  // async loginPhone(@Body() data: AuthLoginMobileDto): Promise<any> {
  //   // Call Robinhood endpoint POST /v1/authentication/otp/mobile/validation
  //   // const response = await this.httpService
  //   //   .post('/v1/authentication/otp/mobile', { data })
  //   //   .toPromise();
  //   const response = {
  //     resultCode: 1000,
  //     status: 'SUCCESSFUL',
  //     errorMessage: 'SUCCESS',
  //     data: {
  //       refToken: 'xxxxxxxxxx',
  //       tokenUUID: 'xxxxxxxxxxxxxxxxx',
  //       expireDateTime: '10-03-2017 08:29:46',
  //       issueDateTime: '10-03-2017 07:29:46',
  //       validDuration: 300,
  //     },
  //   };

  //   if (response.data.validDuration < 30) {
  //     return {
  //       resultCode: 3052,
  //       status: 'Error',
  //       errorMessage: 'This OTP has expired. Please request a new OTP. ',
  //       data: {},
  //     };
  //   }

  //   return response;
  // }

  // @Post('onboarding/login/otp/mobile/validation')
  // @UsePipes(new ValidationPipe())
  // async loginOptMobileValidation(
  //   @Body() data: AuthLoginOptMobileValidationDto,
  // ): Promise<any> {
  //   // Call Robinhood endpoint POST /v1/authentication/otp/mobile/validation
  //   // const response = await this.httpService.post(
  //   //   '/v1/authentication/otp/mobile/validation',
  //   //   data,
  //   // );

  //   const response = {
  //     resultCode: 3013,
  //     status: 'SUCCESSFUL',
  //     errorMessage: 'SUCCESS',
  //     data: {
  //       refToken: 'xxxxxxxxxxxxxxxxx',
  //       remainTimes: 70,
  //       tokenId: 'x0x0x0x0x0x00x0x0x00x0x00x000x0x0x',
  //     },
  //   };

  //   if (response.resultCode == 1899) {
  //     throw BaseError.INFO_NOT_AVAILABLE;
  //   }

  //   if (response.resultCode == 3013) {
  //     throw BaseError.OTP_FAIL;
  //   }

  //   if (response.resultCode === 3014) {
  //     throw BaseError.OTP_EXPIRE();
  //   }

  //   if (response.resultCode === 3015) {
  //     throw BaseError.OTP_NOT_VALID();
  //   }

  //   if (response.resultCode === 3012) {
  //     throw BaseError.PHONE_BLOCKED();
  //   }

  //   return response;
  // }

  // // @Post('register')
  // // async registerPersonal(@Body() body: RegisterDto) {
  // //   if (await this.userService.getUserByName(body.username)) {
  // //     throw new BadRequestException('Username already exists');
  // //   }
  // //
  // //   if (await this.userService.getUserByEmail(body.email)) {
  // //     throw new BadRequestException('Email already exists');
  // //   }
  // //
  // //   const user = await this.userService.create(body);
  // //
  // //   return this.authService.login(user);
  // // }

  // // @Post('register')
  // // @UsePipes(new ValidationPipe())
  // // registerPersonal(@Body() data: UserDto) {
  // //   return this.authService.registerPersonal(data);
  // // }
  // //
  // // @Post('register')
  // // @UsePipes(new ValidationPipe())
  // // registerBusiness(@Body() data: UserDto) {
  // //   return this.authService.register(data);
  // // }

  // @Post('logout')
  // async logout(@Request() req, @Response() res) {
  //   return this.authService.logout(req, res);
  // }

  // // @UseGuards(PermissionsGuard)
  // // @CheckPermissions([PermissionAction.READ, 'team'])
  // // @UseGuards(JwtAuthGuard)
  // // @UseGuards(AuthenticatedGuard)
  // // @UseGuards(JwtAuthGuard)
  // // @Get('onboarding/currentuser')
  // // getUser(@Request() req) {
  // //   // return {message: "haha"};
  // //   return this.authService.getUser(req);
  // // }
}

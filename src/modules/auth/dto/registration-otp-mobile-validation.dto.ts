import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  IsString,
  IsDate,
  ValidateNested,
  IsObject,
  IsEnum,
  Matches,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { REGEX_PASSWORD, REGEX_PHONE_NUMBER } from '../../../shared/contants';

export enum genderValue {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  NONE = 'NONE',
}

export enum registrationModeValue {
  BUSINESS = 'BUSINESS',
  PERSONAL = 'PERSONAL',
}

export class User {
  @IsNotEmpty()
  @IsString()
  @Matches(REGEX_PHONE_NUMBER)
  mobileNo: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  //@Matches(REGEX_PASSWORD)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsNotEmpty()
  termAndCondId: number;

  @IsNotEmpty()
  @IsEnum(genderValue)
  gender: string;

  @IsNotEmpty()
  registerChannel: string;

  @IsNotEmpty()
  deviceId: string;
}

export class Otp {
  @IsNotEmpty()
  @IsString()
  tokenUUID: string;

  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @IsNotEmpty()
  @IsString()
  refToken: string;
}

export class Business {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  typeId: string;
}

export class RegistrationOtpMobileValidationDto {
  @IsNotEmpty()
  @IsEnum(registrationModeValue)
  registrationMode: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => User)
  user: User;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Otp)
  otp: Otp;

  @ValidateIf((o) => o.registrationMode === 'BUSINESS')
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Business)
  business: Business;
}

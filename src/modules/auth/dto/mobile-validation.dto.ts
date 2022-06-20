import {
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsIn,
  Validate,
  ValidateNested,
} from 'class-validator';

export enum valMode {
  REGISTRATION = 'REGISTRATION',
  LOGIN = 'LOGIN',
}

export enum regMode {
  BUSINESS = 'BUSINESS',
  PERSONAL = 'PERSONAL',
}

export enum genderValue {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  NONE = 'NONE',
}

export class MobileValidationDto {
  @IsNotEmpty()
  @IsNumberString()
  mobileNo: string;

  @IsNotEmpty()
  @IsEnum(valMode)
  validationMode: string;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  @IsIn(['BUSINESS', 'PERSONAL'])
  registrationMode: string;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  firstName: string;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  lastName: string;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  @IsIn(['MALE', 'FEMALE', 'OTHER', 'NONE'])
  gender: string;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  termAndCondId: string;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  email: string;

  @ValidateIf((o) => o.validationMode === 'REGISTRATION')
  @IsNotEmpty()
  password: string;

  @ValidateIf(
    (o) =>
      o.validationMode === 'REGISTRATION' && o.registrationMode === 'BUSINESS',
  )
  @IsNotEmpty()
  businessName: string;

  @ValidateIf(
    (o) =>
      o.validationMode === 'REGISTRATION' && o.registrationMode === 'BUSINESS',
  )
  @IsNotEmpty()
  businessTypeId: string;
}

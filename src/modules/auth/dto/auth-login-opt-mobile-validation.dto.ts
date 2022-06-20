import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AuthLoginOptMobileValidationDto {
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

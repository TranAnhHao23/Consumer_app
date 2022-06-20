import { IsNotEmpty, Matches } from 'class-validator';
import { REGEX_PHONE_NUMBER } from 'src/shared/contants';

export class RegistrationOtpMobileDto {
  @IsNotEmpty()
  @Matches(REGEX_PHONE_NUMBER)
  mobileNo: string;
}

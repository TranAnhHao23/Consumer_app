import { HttpException } from '@nestjs/common';

export const BaseError = {
  MOBILE_EXIST: () =>
    new HttpException(
      'This mobile number is related to an existing account. Do you want to sign in?',
      1001,
    ),
  EMAIL_EXIST: () =>
    new HttpException(
      'This email is related to an existing account. Do you want to sign in?',
      1001,
    ),
  BUSINESS_NAME_EXIST: () =>
    new HttpException(
      'This business name is related to an existing account. Do you want to sign in?',
      1001,
    ),
  MOBILE_NOT_EXIST: () =>
    new HttpException(
      'This mobile number is not exist. Do you want to sign up?',
      1002,
    ),

  PASSWORD_NOT_MATCH: () =>
    new HttpException('This password is not match. Please try again.', 1555),

  INFO_NOT_AVAILABLE: () =>
    new HttpException(
      'Information not available, please try again later.',
      1899,
    ),

  INFO_NOT_AVAILABLE_2: () =>
    new HttpException(
      'Information not available, please try again later.',
      1999,
    ),

  OTP_EXPIRED: () =>
    new HttpException('This OTP has expired. Please request a new OTP.', 3052),

  PHONE_BLOCKED: () =>
    new HttpException(
      "This phone number has been blocked by the system. Please contact Robinhood's call center for further information.",
      3012,
    ),

  OTP_FAIL: () => new HttpException('Verify OTP code fail.', 3013),

  OTP_EXPIRE: () => new HttpException('Verify expire date time', 3014),

  OTP_NOT_VALID: () =>
    new HttpException('OTP is not valid less than number of verify', 3015),

  DATA_NOT_FOUND: () => new HttpException('Data not found', 2001),

  DATA_NOT_MATCH: () =>
    new HttpException('Data is not valid or not match', 2002),
};

import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  mobileNo: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(process.env.AES_256_SECRET)
  @IsNotEmpty()
  password: string;
}

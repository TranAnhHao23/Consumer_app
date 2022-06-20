import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @Length(1, 50)
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`[{|}~()-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  )
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  @Matches(/^[a-zA-Z0-9.!@#$%&'*+/=?^_`[{|}~()-]/)
  password: string;
}

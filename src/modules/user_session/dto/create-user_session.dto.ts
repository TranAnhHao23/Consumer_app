import { IsNotEmpty } from 'class-validator';

export class CreateUserSessionDto {
  @IsNotEmpty()
  token: string;
}

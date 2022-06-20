import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSessionDto } from './create-user_session.dto';

export class UpdateUserSessionDto extends PartialType(CreateUserSessionDto) {
  user_id: string;
  token: string;
}

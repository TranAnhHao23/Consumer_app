import { PartialType } from '@nestjs/mapped-types';
import { CreateGuestProfileDto } from './create-guest_profile.dto';

export class UpdateGuestProfileDto extends PartialType(CreateGuestProfileDto) {}

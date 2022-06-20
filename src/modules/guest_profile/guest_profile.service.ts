import { Injectable } from '@nestjs/common';
import { CreateGuestProfileDto } from './dto/create-guest_profile.dto';
import { UpdateGuestProfileDto } from './dto/update-guest_profile.dto';

@Injectable()
export class GuestProfileService {
  create(createGuestProfileDto: CreateGuestProfileDto) {
    return 'This action adds a new guestProfile';
  }

  findAll() {
    return `This action returns all guestProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guestProfile`;
  }

  update(id: number, updateGuestProfileDto: UpdateGuestProfileDto) {
    return `This action updates a #${id} guestProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} guestProfile`;
  }
}

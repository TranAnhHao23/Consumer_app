import { Injectable } from '@nestjs/common';
import { CreateAddressProfileDto } from './dto/create-address_profile.dto';
import { UpdateAddressProfileDto } from './dto/update-address_profile.dto';

@Injectable()
export class AddressProfileService {
  create(createAddressProfileDto: CreateAddressProfileDto) {
    return 'This action adds a new addressProfile';
  }

  findAll() {
    return `This action returns all addressProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} addressProfile`;
  }

  update(id: number, updateAddressProfileDto: UpdateAddressProfileDto) {
    return `This action updates a #${id} addressProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} addressProfile`;
  }
}

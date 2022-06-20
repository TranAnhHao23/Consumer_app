import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressProfileService } from './address_profile.service';
import { CreateAddressProfileDto } from './dto/create-address_profile.dto';
import { UpdateAddressProfileDto } from './dto/update-address_profile.dto';

@ApiTags('address-profiles')
@Controller('address-profiles')
export class AddressProfileController {
  constructor(private readonly addressProfileService: AddressProfileService) {}

  @Post()
  create(@Body() createAddressProfileDto: CreateAddressProfileDto) {
    return this.addressProfileService.create(createAddressProfileDto);
  }

  @Get()
  findAll() {
    return this.addressProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressProfileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAddressProfileDto: UpdateAddressProfileDto,
  ) {
    return this.addressProfileService.update(+id, updateAddressProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressProfileService.remove(+id);
  }
}

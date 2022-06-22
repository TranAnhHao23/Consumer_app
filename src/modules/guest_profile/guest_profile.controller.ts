import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuestProfileService } from './guest_profile.service';
import { CreateGuestProfileDto } from './dto/create-guest_profile.dto';
import { UpdateGuestProfileDto } from './dto/update-guest_profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('guest-profiles')
@Controller('guest-profiles')
export class GuestProfileController {
  // constructor(private readonly guestProfileService: GuestProfileService) {}

  // @Post()
  // create(@Body() createGuestProfileDto: CreateGuestProfileDto) {
  //   return this.guestProfileService.create(createGuestProfileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.guestProfileService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.guestProfileService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateGuestProfileDto: UpdateGuestProfileDto,
  // ) {
  //   return this.guestProfileService.update(+id, updateGuestProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.guestProfileService.remove(+id);
  // }
}

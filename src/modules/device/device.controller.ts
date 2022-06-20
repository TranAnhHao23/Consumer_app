import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    const device = this.deviceService.createDevice(createDeviceDto);
    if (!device) {
      return {
        resultCode: 1001,
        status: 'FAILED',
        errorMessage: 'Missing device data!',
      };
    }
    return {
      resultCode: 1000,
      status: 'SUCCESS',
      errorMessage: null,
    };
  }

  @Get()
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(+id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceService.remove(+id);
  }
}

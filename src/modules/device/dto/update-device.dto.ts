import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
  brand: string;

  model: string;

  platform: string;

  os: string;

  appVersion: string;

  webVersion: string;
}

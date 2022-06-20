import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isNullOrUndefined } from 'util';

export enum programType {
  APP = 'APP',
  WEB = 'WEB',
}

export class CreateDeviceDto {
  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(programType)
  platform: string;

  @IsNotEmpty()
  os: string;

  @IsOptional()
  appVersion: string;

  @IsOptional()
  webVersion: string;
}

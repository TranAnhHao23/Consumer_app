import { IsNotEmpty, IsOptional, IsEnum, IsString } from 'class-validator';

export enum programType {
  APP = 'APP',
  WEB = 'WEB',
}

export class DeviceDto {
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

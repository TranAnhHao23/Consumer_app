import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceEntity } from './entities/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}
  async createDevice(DeviceData: any) {
    const newDevice = this.deviceRepository.create(DeviceData);
    return await this.deviceRepository.save(newDevice);
  }

  findAll() {
    return `This action returns all device`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(name: string) {
    return name;
  }
}

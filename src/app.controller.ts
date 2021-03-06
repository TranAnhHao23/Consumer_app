import {Body, Controller, Get, HttpStatus, Post} from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ResponseResult } from './shared/ResponseResult';
import {NotificationDto} from "./modules/locations/dto/Notification.dto";
@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private apiResponse: ResponseResult
    ) {}

  // @Get('health')
  // async getHello(@I18n() i18n: I18nContext) {
  //   return await i18n.t('translation.HEALTH');
  // }

  @Get('/v1/rhc/banners')
  findAll() {
    this.apiResponse = new ResponseResult()
    this.apiResponse.status = HttpStatus.OK
    this.apiResponse.data = [
      {
        url: 'https://i.ibb.co/6HcNz1Y/Group-69802-1.png'
      },
      {
        url: 'https://i.ibb.co/6HcNz1Y/Group-69802-1.png'
      },
      {
        url: 'https://i.ibb.co/6HcNz1Y/Group-69802-1.png'
      },
      {
        url: 'https://i.ibb.co/6HcNz1Y/Group-69802-1.png'
      }
    ]
    return this.apiResponse
  }

  @Post('sendNotification')
  async sendNotificationToFirebase(@Body() notificationDto: NotificationDto) {
    return this.appService.sendNotificationToFirebase(notificationDto);
  }
}

import {HttpException, Injectable} from '@nestjs/common';
import {NotificationDto} from "./modules/locations/dto/Notification.dto";
import {ResponseResult} from "./shared/ResponseResult";

import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  async getHello(name: string) {
    return name;
  }

  async sendNotificationToFirebase(notificationDto: NotificationDto) {
      const apiResponse = new ResponseResult();

      let fireStore = admin.firestore();
      const settings = {timestampInSnapshots: true};
      fireStore.settings(settings);

      let notification = {
          'title': notificationDto.title,
          'message': notificationDto.message,
          'createdTime': new Date(),
      }
      try {
          let userRef = fireStore.collection(notificationDto.userId);
          let result = await userRef.add(notification);
          console.log(result);
          apiResponse.data = result;
      } catch (error) {
          apiResponse.status = error.status;
          apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
      }
      return apiResponse;
  }
}

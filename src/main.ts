import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
import {ConfigService} from "@nestjs/config";
import {ServiceAccount} from "firebase-admin";

import * as admin from 'firebase-admin';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.setGlobalPrefix('v1/rhc')
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Consumer App')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const configService: ConfigService = app.get(ConfigService);
    // Set the config options
    const adminConfig = require("C:\\Users\\tahao\\OneDrive - CMC Global\\Desktop\\Clone\\ride-hailing-consumer-api\\serviceAccountKey.json")

    admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        databaseURL: "https://democustomerapp-7e120-default-rtdb.firebaseio.com"
    })

    app.enableCors();

    await app.listen(3000);
}

bootstrap();

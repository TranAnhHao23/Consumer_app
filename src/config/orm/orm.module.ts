import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';  
// const entities = [Users];
// const entities = [__dirname + '/**/entity/*.entity{.ts,.js}'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [  
      ],
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class ORMModule {}

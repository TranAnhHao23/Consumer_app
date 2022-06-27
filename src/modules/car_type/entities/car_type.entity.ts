import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity, OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import {Car_detailEntity} from "./car_detail.entity";

@Entity({ name: 'car_type' })
export class Car_typeEntity extends BaseEntity {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @PrimaryGeneratedColumn('uuid', { name: 'car_type_id', length: 45 })
  id: string;

  @Column({ name: 'type_name' })
  typeName: string;

  @Column({ name: 'type_slogan', length: 255 })
  typeSlogan: string;

  @Column({ name: 'car_image', nullable: true })
  carImage: string;

  @Column({ name: 'car_icon', nullable: true })
  carIcon: string;

  @Column({type: 'decimal', precision: 10, scale: 5 , name: 'longitude', nullable: true,
    transformer: {
      to(value) {return value}, from(value) {return parseFloat(value)}
    },})
  longitude: number;

  @Column({type: 'decimal', precision: 10, scale: 5 , name: 'latitude', nullable: true,
    transformer: {
      to(value) {return value}, from(value) {return parseFloat(value)}
    },})
  latitude: number;

  @Column({type: 'decimal', precision: 10, scale: 5 , name: 'price',  nullable: true,
    transformer: {
      to(value) {return value}, from(value) {return parseFloat(value)}
    },})
  price: number;

  @Column({ name: 'orders',
    transformer: {
      to(value) {return value}, from(value) {return parseFloat(value)}
    },})
  orders: number;

  @OneToMany(() => Car_detailEntity, carDetail => carDetail.carType)
  carDetails: Car_detailEntity[]
}

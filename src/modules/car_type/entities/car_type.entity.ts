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

  @Column({type: 'decimal',scale: 5, name: 'longitude', nullable: true })
  longitude: number;

  @Column({type: 'decimal',scale: 5, name: 'latitude', nullable: true })
  latitude: number;

  @Column({ name: 'price', nullable: true, default: 0 })
  price: number;

  @Column({ name: 'orders'})
  orders: number;

  @OneToMany(() => Car_detailEntity, carDetail => carDetail.carType)
  carDetails: Car_detailEntity[]
}

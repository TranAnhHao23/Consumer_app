import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';

@Entity({ name: 'car_type' })
export class Car_typeEntity extends BaseEntity {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @PrimaryGeneratedColumn('uuid', { name: 'car_id', length: 55 })
  id: string;

  @Column({ name: 'type_name' })
  typeName: string;

  @Column({ name: 'type_slogan', length: 255 })
  typeSlogan: string;

  @Column({ name: 'car_image', nullable: true })
  carImage: string;

  @Column({ name: 'car_icon', nullable: true })
  carIcon: string;

  @Column({ name: 'first_distance_fee', nullable: true })
  firstDistanceFee: number;

  @Column({ name: 'second_distance_fee', nullable: true })
  secondDistanceFee: number;

  @Column({ name: 'third_distance_fee', nullable: true })
  thirdDistanceFee: number;

  @Column({ name: 'fourth_distance_fee', nullable: true })
  fourthDistanceFee: number;

  @Column({ name: 'fifth_distance_fee', nullable: true })
  fifthDistanceFee: number;

  @Column({ name: 'sixth_distance_fee', nullable: true })
  sixthDistanceFee: number;

  @Column({ name: 'seventh_distance_fee', nullable: true })
  seventhDistanceFee: number;

  @Column({ name: 'platform_fee', nullable: true })
  platformFee: number;

  @Column({ name: 'waiting_fee', nullable: true })
  waitingFee: number;

  @Column({ name: 'longitude', nullable: true })
  longitude: string;

  @Column({ name: 'latitude', nullable: true })
  latitude: string;

  @Column({ name: 'price', nullable: true, default: 0 })
  price: number;
}

import { ToNumericTrans } from 'src/shared/column-numeric-transformer';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity, OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import {CarDetailEntity} from "./car_detail.entity";

@Entity({ name: 'car_type' })
export class CarTypeEntity extends BaseEntity {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @PrimaryGeneratedColumn('uuid', { name: 'id', length: 45 })
  id: string;

  @Column({ name: 'type_name' })
  typeName: string;

  @Column({ name: 'type_slogan', length: 255 })
  typeSlogan: string;

  @Column({ name: 'car_image', nullable: true })
  carImage: string;

  @Column({ name: 'car_icon', nullable: true })
  carIcon: string;

  @Column({type: 'decimal', precision: 10, scale: 5 , name: 'longitude', nullable: true, transformer: new ToNumericTrans })
  longitude: number;

  @Column({type: 'decimal', precision: 10, scale: 5 , name: 'latitude', nullable: true, transformer: new ToNumericTrans })
  latitude: number;

  @Column({type: 'decimal', precision: 10, scale: 5 , name: 'price',  nullable: true, transformer: new ToNumericTrans })
  price: number;

  @Column({ name: 'orders', select: false })
  orders: number;

  @Column({ name: 'category', select: false})
  category: string;

  @OneToMany(() => CarDetailEntity, carDetail => carDetail.carType)
  carDetails: CarDetailEntity[]
}

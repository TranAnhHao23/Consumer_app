import { BookingEntity } from 'src/modules/bookings/entities/booking.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'car' })
export class CarEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'car_id' })
  carId: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @Column({ name: 'cartype_id' })
  carTypeId: string;

  @Column({ name: 'icon', length: 255 })
  icon: string;

  @Column({ name: 'size' })
  size: string;

  @Column({ name: 'license_plate_number', nullable: true })
  licensePlateNumber: string;

  @Column({ name: 'branch' })
  branch: string;

  @Column({ name: 'color' })
  color: string;

  @Column({ name: 'region', length: 255 })
  region: string;
  
  @OneToMany(() => BookingEntity, booking => booking.carInfo)
  booking: BookingEntity[]
}
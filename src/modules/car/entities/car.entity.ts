import { BookingEntity } from 'src/modules/bookings/entities/booking.entity';
import { CarTypeEntity } from 'src/modules/car_type/entities/car_type.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'car' })
@Unique('unique_booking', ['booking.id'])
export class CarEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'car_id' })
  carId: string;

  // @Column({ name: 'driver_id' })
  // driverId: string;

  @ManyToOne(() => CarTypeEntity, { eager: true })
  @JoinColumn({ name: 'car_type_id' })
  carType: CarTypeEntity

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
  
  @OneToOne(() => BookingEntity)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

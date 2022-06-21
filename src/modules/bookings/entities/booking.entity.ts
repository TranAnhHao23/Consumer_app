import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TripEntity } from '../../trips/entities/trip.entity';

@Entity({ name: 'booking' })
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'car_id', length: 45 })
  carId: string;

  @OneToOne(() => TripEntity, { nullable: true })
  @JoinColumn({ name: 'trip_id' })
  trip: TripEntity;

  @Column({ name: 'driver_id', length: 45 })
  driverId: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'price', nullable: true })
  price: string;

  @Column({ name: 'tip_amount', default: 0 })
  tipAmount: string;

  @Column({ name: 'tip_reason', length: 255, nullable: true })
  tipReason: string;

  @Column({ name: 'cancel_reason', length: 255, nullable: true })
  cancelReason: string;

  @Column({ name: 'booking_start_time', nullable: true })
  bookingStartTime: Date;

  @Column({ name: 'start_time', nullable: true })
  startTime: Date;

  @Column({ name: 'arrived_time', nullable: true })
  arrivedTime: Date;

  @Column({ name: 'create_at' })
  @CreateDateColumn()
  createAt: Date;

  @Column({ name: 'update_at' })
  @UpdateDateColumn()
  updateAt: Date;
}

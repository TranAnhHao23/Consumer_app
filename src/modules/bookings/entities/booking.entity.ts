import { Promotion } from 'src/modules/promotion/entities/promotion.entity';
import { ToNumericTrans } from 'src/shared/column-numeric-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
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

  @Column({ name: 'user_Id', length: 45 })
  userId: string;

  @OneToOne(() => TripEntity, { nullable: true })
  @JoinColumn({ name: 'trip_id' })
  trip: TripEntity;

  @OneToMany(() => Promotion, (promotion) => promotion.booking)
  promotions: Promotion[];

  @Column({ name: 'driver_id', length: 45 })
  driverId: string;

  @Column({ name: 'status' })
  status: number;

  @Column({ type: "decimal", precision: 10, scale: 5, name: 'distance', default: 0, transformer: new ToNumericTrans })
  distance: number;

  @Column({ type: "decimal", precision: 10, scale: 5, name: 'price', default: 0, transformer: new ToNumericTrans })
  price: number;

  @Column({ type: "decimal", precision: 10, scale: 5, name: 'tip_amount', default: 0, transformer: new ToNumericTrans })
  tipAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 5, name: 'promotion_amount', default: 0, transformer: new ToNumericTrans })
  promotionAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 5, name: 'total_amount', default: 0, transformer: new ToNumericTrans })
  totalAmount: number;

  @Column({ name: 'tip_reason', length: 255, nullable: true })
  tipReason: string;

  @Column({ name: 'cancel_reason', length: 255, nullable: true })
  cancelReason: string;

  @Column({ name: 'cancel_time', nullable: true})
  cancelTime: Date;

  @Column({ name: 'booking_start_time', nullable: true })
  bookingStartTime: Date;

  @Column({ name: 'start_time', nullable: true })
  startTime: Date;

  @Column({ name: 'arrived_time', nullable: true })
  arrivedTime: Date;

  @Column({ name: 'note_for_driver', length: 255, nullable: true })
  noteForDriver: string;

  @Column({ name: 'is_liked', default: false })
  isLiked: boolean;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;
}

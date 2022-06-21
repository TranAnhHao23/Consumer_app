import { TripEntity } from "src/modules/trips/entities/trip.entity";
import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({ name: 'booking'})
export class BookingEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => TripEntity, {nullable: false})
    @JoinColumn({name: 'trip_id'})
    trip: TripEntity;

    @Column({ name: 'car_id', length: 45})
    carId: string;

    @Column({ name: 'driver_id', length: 45})
    driverId: string;

    @Column({ name: 'status'})
    status: string;

    @Column({ name: 'price', nullable: true})
    price: string;

    @Column({ name: 'tip_amount', default: 0})
    tipAmount: string;

    @Column({ name: 'tip_reason',length: 255, nullable: true})
    tipReason: string;

    @Column({ name: 'cancel_reason', length: 255, nullable: true})
    cancelReason: string;

    @Column({ name: 'booking_start_time', nullable: true})
    bookingStartTime: Date;

    @Column({ name: 'start_time', nullable: true})
    startTime: Date;

    @Column({ name: 'arrived_time', nullable: true})
    arrivedTime: Date;

    @Column({ name: 'created_at'})
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at'})
    @UpdateDateColumn()
    updatedAt: Date;
}

import { BookingEntity } from 'src/modules/bookings/entities/booking.entity';
import { ToNumericTrans } from 'src/shared/column-numeric-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'driver' })
export class DriverEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'driver_id' })
    driverId: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'avatar' })
    avatar: string;

    @Column({ name: 'phone_num', length: 255 })
    phoneNum: string;

    @Column({ type: "decimal", precision: 2, scale: 1, name: 'rating', default: 0, transformer: new ToNumericTrans })
    rating: number;

    @Column({ type: "decimal", precision: 10, scale: 5, name: 'latitude', default: 0, transformer: new ToNumericTrans })
    latitude: number;

    @Column({ type: "decimal", precision: 10, scale: 5, name: 'longitude', default: 0, transformer: new ToNumericTrans })
    longitude: number;

    @Column({ name: 'status' })
    status: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => BookingEntity)
    @JoinColumn({ name: 'booking_id' })
    booking: BookingEntity
}

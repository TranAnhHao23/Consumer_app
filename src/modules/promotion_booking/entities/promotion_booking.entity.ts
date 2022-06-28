import { BookingEntity } from "src/modules/bookings/entities/booking.entity";
import { Promotion } from "src/modules/promotion/entities/promotion.entity";
import { BaseEntity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class PromotionBooking extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => BookingEntity, { nullable: true })
    @JoinColumn({ name: 'booking_id' })
    booking: BookingEntity;

    @OneToOne(() => Promotion, { nullable: true })
    @JoinColumn({ name: 'promotion_id' })
    promotion: Promotion;
}

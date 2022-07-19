import { BookingEntity } from "src/modules/bookings/entities/booking.entity"; 
import { PaymentTypeEntity } from "src/payment-type/entities/payment-type.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'payment_method' })
export class PaymentMethod extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', length: 45, nullable: false})
    userId: string;
  
    @Column({ name: 'name', length: 50, nullable: false })
    name: string;

    @Column({ name: 'nickname', length: 255 })
    nickname: string;
   
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
    
    @Column({ name: 'order', nullable: true })
    order: number;

    @Column({ name: 'is_default', default: false })
    isDefault: boolean;

    @Column({ name: 'card_last_digits', length: 4, nullable: true })
    cardLastDigits: string

    @Column({ name: 'is_deleted', default: false, select: false })
    isDeleted: boolean

    @ManyToOne(() => PaymentTypeEntity, { nullable: false })
    @JoinColumn({ name: 'payment_type_id' })
    paymentType: PaymentTypeEntity;

    // @OneToMany(() => BookingEntity, (booking) => booking.paymentMethod)
    // bookings: BookingEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

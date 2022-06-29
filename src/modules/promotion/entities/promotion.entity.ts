import { BookingEntity } from "src/modules/bookings/entities/booking.entity";
import { ToNumericTrans } from "src/shared/column-numeric-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("Promotion")
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', length: 50, nullable: false })
  code: string;

  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'user_Id', length: 45 })
  userId: string;

  @Column({ type: "decimal", precision: 10, scale: 5, name: 'amount', default: 0, transformer: new ToNumericTrans })
  amount: number;

  @Column({ name: 'promo_type', transformer: new ToNumericTrans })
  promoType: number;

  @ManyToOne(() => BookingEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column({ name: 'currency', length: 45 })
  currency: string;

  @Column({ name: 'status', transformer: new ToNumericTrans })
  status: number;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;

  @Column({ name: 'expired_date', nullable: true })
  expiredDate: Date;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;
}

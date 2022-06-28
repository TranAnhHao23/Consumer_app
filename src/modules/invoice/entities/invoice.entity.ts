import { BookingEntity } from "src/modules/bookings/entities/booking.entity";
import { PaymentMethod } from "src/modules/paymentmethod/entities/paymentmethod.entity";
import { ToNumericTrans } from "src/shared/column-numeric-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("Invoice")
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_no', length: 45, nullable: true})
  orderNo: string;

  @Column({ name: 'user_Id', length: 45})
  userId: string; 

  @OneToOne(() => BookingEntity, { nullable: true })
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;
 
  @OneToOne(() => PaymentMethod, { nullable: true })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
 
  @Column({type: "decimal", precision: 10, scale: 5, name: 'amount', default: 0, transformer: new ToNumericTrans})
  amount: number;

  @Column({ name: 'invoice_status'})
  invoiceStatus: number;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;
  
  @Column({ name: 'result_id', nullable: true})
  resultId: string;

  @Column({ name: 'result_content', nullable: true})
  resultContent: string;
 
  @Column({ name: 'payment_date', nullable: true })
  paymentDate: Date;

  @Column({ name: 'created_at'})
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at'})
  @UpdateDateColumn()
  updatedAt: Date;
}

import { BookingEntity } from "src/modules/bookings/entities/booking.entity";
import { Column, CreateDateColumn, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_no', length: 45})
  OrderNo: string;

  @Column({ name: 'user_Id', length: 45})
  userId: string; 

  @OneToOne(() => BookingEntity, { nullable: true })
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;
 
  @Column({ name: 'payment_type_id'})
  paymentTypeId: number;
 
  @Column({type: "decimal", precision: 10, scale: 5, name: 'amount', default: 0})
  amount: number;

  @Column({ name: 'payment_status'})
  paymentStatus: number;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;
  
  @Column({ name: 'result_id'})
  resultId: string;

  @Column({ name: 'result_content'})
  resultContent: string;
 
  @Column({ name: 'payment_date', nullable: true })
  paymentDate: Date;

  @Column({ name: 'create_at' })
  @CreateDateColumn()
  createAt: Date;

  @Column({ name: 'update_at' })
  @UpdateDateColumn()
  updateAt: Date;
}

import { ToNumericTrans } from "src/shared/column-numeric-transformer";
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Promotion extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 255, nullable: true})
  name: string;

  @Column({ name: 'user_Id', length: 45})
  userId: string; 
 
  @Column({type: "decimal", precision: 10, scale: 5, name: 'amount', default: 0, transformer: new ToNumericTrans})
  amount: number;

  @Column({ name: 'promo_type',transformer: new ToNumericTrans})
  promoType: number;

  @Column({ name: 'currency',transformer: new ToNumericTrans})
  currency : number;

  @Column({ name: 'status',transformer: new ToNumericTrans})
  status: number;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;
 
  @Column({ name: 'expired_date', nullable: true })
  expiredDate: Date;

  @Column({ name: 'created_at'})
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at'})
  @UpdateDateColumn()
  updatedAt: Date;
}

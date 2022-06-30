import { Invoice } from "src/modules/invoice/entities/invoice.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'payment_method' })
export class PaymentMethod extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_Id', length: 45, nullable: false})
    userId: string;
  
    @Column({ name: 'name', length: 50, nullable: false })
    name: string;
    
    @Column({ name: 'icon', length: 255, nullable: true })
    icon: string;
  
    @Column({ name: 'note', length: 255, nullable: true })
    note: string;
   
    @Column({ name: 'status', nullable: false })
    status: number;
  
    @Column({ name: 'order', nullable: true })
    order: number;

    @Column({ name: 'isDefault', nullable: true })
    isDefault: boolean;

    @Column({ name: 'payment_type_id', length: 45, nullable: true})
    paymentType: string;

    @OneToMany(() => Invoice, (invoice) => invoice.paymentMethod)
    invoices: Invoice[];

    @Column({ name: 'create_at' })
    @CreateDateColumn()
    createAt: Date;
  
    @Column({ name: 'update_at' })
    @UpdateDateColumn()
    updateAt: Date;
}

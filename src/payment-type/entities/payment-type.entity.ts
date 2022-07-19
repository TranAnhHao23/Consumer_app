import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_type')
export class PaymentTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'name', length: 64 })
    name: string

    @Column({ name: 'icon' })
    icon: string
}
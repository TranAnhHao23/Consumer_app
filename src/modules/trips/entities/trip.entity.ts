import {BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { v4 as uuid4 } from 'uuid';

@Entity({ name: 'trip'})
export class TripEntity extends BaseEntity{
    @PrimaryColumn({ name: 'trip_id', length: 45})
    id: string;

    @Column({ name: 'user_id', length: 45})
    userId: string;

    @Column({ name: 'car_type'})
    carType: string;

    @Column({ name: 'is_drafting'})
    isDrafting: boolean;

    @Column({ name: 'create_at'})
    @CreateDateColumn()
    createAt: Date;

    @Column({ name: 'update_at'})
    @UpdateDateColumn()
    updateAt: Date;

    @BeforeInsert()
    generateId() {
        const uuid = uuid4();
        const randomNumber = Math.random().toString().slice(2,11);
        this.id = uuid + randomNumber;
    }
}

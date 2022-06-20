import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({ name: 'trip'})
export class TripEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'device_id'})
    deviceId: string;

    @Column({ name: 'car_type'})
    carType: number;

    @Column({ name: 'is_drafting'})
    isDrafting: boolean;

    @Column({ name: 'created_at'})
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at'})
    @UpdateDateColumn()
    updatedAt: Date;
}
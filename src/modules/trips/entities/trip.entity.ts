import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn, JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {LocationEntity} from "../../locations/entities/location.entity";

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

    @OneToMany(() => LocationEntity, (location) => location.tripId)
    locations: LocationEntity[];

    @Column({ name: 'created_at'})
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at'})
    @UpdateDateColumn()
    updatedAt: Date;
}
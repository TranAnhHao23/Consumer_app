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

    @Column({ name: 'car_type', nullable: true })
    carType: number;

    @Column({ name: 'is_drafting'})
    isDrafting: boolean;

    @Column({ name: 'start_time', nullable: true })
    startTime: Date;

    @Column({ name: 'total_time', nullable: true})
    totalTime: number;

    @Column({ name: 'copy_trip_id', type: 'uuid', length: 36, nullable: true })
    copyTripId: string

    @OneToMany(() => LocationEntity, (location) => location.trip)
    locations: LocationEntity[];

    @Column({ name: 'created_at'})
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at'})
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({name: 'is_silent_trip'})
    isSilent: boolean;

    @Column({ name: 'note_for_driver', length: 255, nullable: true })
    noteForDriver: string;

    @Column({ name: 'is_trip_later', default: false})
    isTripLater: boolean;
}

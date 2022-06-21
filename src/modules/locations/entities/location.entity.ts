import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";
import { TripEntity } from "src/modules/trips/entities/trip.entity";

@Entity({ name: 'location'})
@Unique('unique_trip_id_milestone', ['milestone', 'trip.id'])
export class LocationEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'longitude'})
    longitude: number;

    @Column({ name: 'latitude'})
    latitude: number;

    @Column({ name: 'address', length: 255})
    address: string;

    @Column({ name: 'note', length: 255, nullable: true})
    note: string;

    @ManyToOne(() => TripEntity , { nullable: false })
    @JoinColumn({ name: 'trip_id', referencedColumnName: 'id' })
    trip: TripEntity;

    @Column({ name: 'milestone'})
    milestone: number;

    @Column({ name: 'created_at'})
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at'})
    @UpdateDateColumn()
    updatedAt: Date;
}

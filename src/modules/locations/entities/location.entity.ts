import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,

    PrimaryColumn, PrimaryGeneratedColumn, Unique,
    UpdateDateColumn
} from "typeorm";
import {TripEntity} from "../../trips/entities/trip.entity";
import {map} from "rxjs";

@Entity({ name: 'location'})
@Unique("trip_unique", ["trip.id","milestone"])
export class LocationEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', name: 'longitude'})
    longitude: number;

    @Column({ type: 'decimal', name: 'latitude'})
    latitude: number;

    @Column({ name: 'address', length: 255})
    address: string;

    @Column({ name: 'note', length: 255, nullable: true})
    note: string;

    @ManyToOne(() => TripEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'trip_id'})
    trip: TripEntity;

    @Column({ name: 'milestone'})
    milestone: number;

    @Column({ name: 'created_at'})
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at'})
    @UpdateDateColumn()
    updateAt: Date;
}

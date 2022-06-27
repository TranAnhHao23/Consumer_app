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

    @Column({ type: 'decimal', precision: 10, scale: 5 , name: 'longitude',
        transformer: {
            to(value) {return value}, from(value) {return parseFloat(value)}
        },})
    longitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 5 , name: 'latitude',
        transformer: {
            to(value) {return value}, from(value) {return parseFloat(value)}
        },})
    latitude: number;

    @Column({ name: 'address', length: 255})
    address: string;

    @Column({ name: 'note', length: 255, nullable: true})
    note: string;

    @ManyToOne(() => TripEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'trip_id'})
    trip: TripEntity;

    @Column({ name: 'milestone',
        transformer: {
            to(value) {return value}, from(value) {return parseFloat(value)}
        },})
    milestone: number;

    @Column({ name: 'google_id' })
    googleId: string;

    @Column({ name: 'reference_id' })
    referenceId: string;

    @Column({ name: 'created_at'})
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: 'updated_at'})
    @UpdateDateColumn()
    updateAt: Date;

    @Column({ name: 'address_name'})
    addressName: string;
}

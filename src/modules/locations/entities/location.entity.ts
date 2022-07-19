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
import {TripEntity} from "../../trips/entities/trip.entity";
import { ToNumericTrans } from "src/shared/column-numeric-transformer";
@Entity({ name: 'location'})
@Unique("trip_unique", ["trip.id","milestone"])
export class LocationEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 5 , name: 'longitude', transformer: new ToNumericTrans })
    longitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 5 , name: 'latitude', transformer: new ToNumericTrans })
    latitude: number;

    @Column({ name: 'address', length: 255})
    address: string;

    @Column({ name: 'note', length: 255, nullable: true})
    note: string;

    @ManyToOne(() => TripEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'trip_id'})
    trip: TripEntity;

    @Column({ name: 'milestone' })
    milestone: number;

    @Column({ name: 'google_id' })
    googleId: string;

    @Column({ name: 'reference_id' })
    referenceId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'address_name', nullable: true })
    addressName: string;

    @Column({ name: 'arrived_time', nullable: true })
    arrivedTime: Date;
}

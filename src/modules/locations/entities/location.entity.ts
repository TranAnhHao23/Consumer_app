import {
    BaseEntity, BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {TripEntity} from "../../trips/entities/trip.entity";
import { v4 as uuid4 } from 'uuid';

@Entity({ name: 'location'})
export class LocationEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'longitude'})
    longitude: string;

    @Column({ name: 'latitude'})
    latitude: string;

    @Column({ name: 'address', length: 255})
    address: string;

    @Column({ name: 'note', length: 255, nullable: true})
    note: string;

    @ManyToOne(() => TripEntity, {nullable: true})
    @JoinColumn({name: 'trip_id'})
    trip: TripEntity;

    @Column({ name: 'milestone'})
    milestone: string;

    @Column({ name: 'create_at'})
    @CreateDateColumn()
    createAt: Date;

    @Column({ name: 'update_at'})
    @UpdateDateColumn()
    updateAt: Date;
}

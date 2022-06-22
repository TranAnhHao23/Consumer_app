import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TripEntity} from "../../trips/entities/trip.entity";
import {Car_typeEntity} from "./car_type.entity";

@Entity({name: 'car_detail'})
export class Car_detailEntity extends BaseEntity{
    // @ts-ignore
    @PrimaryGeneratedColumn('uuid', {name: 'car_detail_id', length: 45})
    id: string;

    @Column({ name: 'label', length: 255})
    label: string;

    @Column({ name: 'min_distance', nullable: true})
    minDistance: number;

    @Column({ name: 'max_distance', nullable: true})
    maxDistance: number;

    @Column({type: 'decimal', precision: 5, scale: 2, name: 'price'})
    price: number;

    @Column({name: 'currency'})
    currency: string;

    @Column({ name: 'orders'})
    orders: number;

    @ManyToOne(() => Car_typeEntity)
    @JoinColumn({ name: 'car_type_id'})
    carType: Car_typeEntity;

}
import { ToNumericTrans } from "src/shared/column-numeric-transformer";
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CarTypeEntity} from "./car_type.entity";

@Entity({name: 'car_detail'})
export class CarDetailEntity extends BaseEntity{
    // @ts-ignore
    @PrimaryGeneratedColumn('uuid', {name: 'car_detail_id', length: 45})
    id: string;

    @Column({ name: 'label', length: 255})
    label: string;

    @Column({ name: 'min_distance', nullable: true, transformer: new ToNumericTrans })
    minDistance: number;

    @Column({ name: 'max_distance', nullable: true, transformer: new ToNumericTrans })
    maxDistance: number;

    @Column({type: 'decimal', precision: 5, scale: 2, name: 'price', transformer: new ToNumericTrans })
    price: number;

    @Column({name: 'currency'})
    currency: string;

    @Column({ name: 'orders', transformer: new ToNumericTrans })
    orders: number;

    @ManyToOne(() => CarTypeEntity)
    @JoinColumn({ name: 'car_type_id'})
    carType: CarTypeEntity;

}
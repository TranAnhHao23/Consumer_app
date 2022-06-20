import {BaseEntity, BeforeInsert, Column, Entity, PrimaryColumn} from "typeorm";
import { v4 as uuid4 } from 'uuid';

@Entity({ name: 'car_type'})
export class Car_typeEntity extends BaseEntity {
    @PrimaryColumn({ name: 'car_type_id', length: 45})
    id: string;

    @Column({ name: 'type_name'})
    typeName: string;

    @Column({ name: 'type_slogan', length: 255})
    typeSlogan: string;

    @Column({ name: 'car_image', nullable: true})
    carImage: string;

    @Column({ name: 'car_icon', nullable: true})
    carIcon: string;

    @Column({ name: 'first_distance_fee', nullable: true})
    firstDistanceFee: number;

    @Column({ name: 'second_distance_fee', nullable: true})
    secondDistanceFee: number;

    @Column({ name: 'third_distance_fee', nullable: true})
    thirdDistanceFee: number;

    @Column({ name: 'fourth_distance_fee', nullable: true})
    fourthDistanceFee: number;

    @Column({ name: 'fifth_distance_fee', nullable: true})
    fifthDistanceFee: number;

    @Column({ name: 'sixth_distance_fee', nullable: true})
    sixthDistanceFee: number;

    @Column({ name: 'seventh_distance_fee', nullable: true})
    seventhDistanceFee: number;
    
    @Column({ name: 'platform_fee', nullable: true})
    platformFee: number;

    @Column({ name: 'waiting_fee', nullable: true})
    waitingFee: number;

    // @Column({ name: 'longtitude', nullable: true})


    @BeforeInsert()
    generateId() {
        const uuid = uuid4();
        const randomNumber = Math.random().toString().slice(2, 11);
        this.id = uuid + randomNumber;
    }
}

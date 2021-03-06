import { IsNumber } from 'class-validator';
import { ToNumericTrans } from 'src/shared/column-numeric-transformer';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';

@Entity({ name: 'favourite_location' })
export class Favourite_locationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', length: 45, nullable: true })
  userId: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({type: "decimal", precision: 10, scale: 5 , name: 'longitude', transformer: new ToNumericTrans })
  longitude: number;

  @Column({type: "decimal", precision: 10, scale: 5 , name: 'latitude', transformer: new ToNumericTrans })
  latitude: number;

  @Column({ name: 'address', length: 255 })
  address: string;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ name: 'google_id' })
  googleId: string;

  @Column({ name: 'reference_id' })
  referenceId: string;

  @Column({ name: 'address_name'})
  addressName: string;

}

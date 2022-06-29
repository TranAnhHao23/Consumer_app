import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';

@Entity({ name: 'address_profile' })
export class AddressProfileEntity extends BaseEntity {
  @PrimaryColumn({ name: 'address_id', length: 45 })
  id: string;

  @Column({ name: 'address', length: 300, nullable: true })
  address: string;

  @Column({ name: 'province_id', length: 45, nullable: true })
  provinceId: string;

  @Column({ name: 'district_id', length: 45, nullable: true })
  districtId: string;

  @Column({ name: 'sub_district_id', length: 45, nullable: true })
  subDistrictId: string;

  @Column({ name: 'postal_id', length: 45, nullable: true })
  postalId: string;

  @Column({ name: 'created_date', nullable: true })
  @CreateDateColumn()
  createdDate: Date;

  @Column({ name: 'updated_date', nullable: true })
  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ name: 'created_by', length: 45, nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', length: 45, nullable: true })
  updatedBy: string;

  @OneToMany(() => UserEntity, (user) => user.address)
  users: UserEntity[];

  @BeforeInsert()
  generateId() {
    const uuid = uuid4();
    const randomNumber = Math.random().toString().slice(2, 11);
    this.id = uuid + randomNumber;
  }
}

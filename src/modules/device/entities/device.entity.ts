import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';

export enum Platform {
  APP = 'App',
  WEB = 'Web',
}

@Entity({ name: 'device' })
export class DeviceEntity extends BaseEntity {
  @PrimaryColumn({ name: 'device_id', length: 45 })
  id: string;

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @Column({ name: 'brand', length: 100, default: 'NuLL' })
  brand: string;

  @Column({ name: 'model', length: 100, default: 'NuLL' })
  model: string;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform: Platform;

  @Column({ name: 'os', length: 100, default: 'Window' })
  os: string;

  @Column({ name: 'app_version', nullable: true })
  appVersion: string;

  @Column({ name: 'web_version', nullable: true })
  webVersion: string;

  @Column({ name: 'device_token', length: 200, nullable: true })
  deviceToken: string;

  @Column({ name: 'created_date' })
  @CreateDateColumn()
  createdDate: Date;

  @Column({ name: 'updated_date' })
  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ name: 'created_by', length: 45, default: 'Anonymous' })
  createdBy: string;

  @Column({ name: 'updated_by', length: 45, default: 'Anonymous' })
  updatedBy: string;

  @BeforeInsert()
  generateId() {
    const uuid = uuid4();
    const randomNumber = Math.random().toString().slice(2, 11);
    this.id = uuid + randomNumber;
  }
}

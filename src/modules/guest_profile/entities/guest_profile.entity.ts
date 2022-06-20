import { DeviceEntity } from 'src/modules/device/entities/device.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'guest_profile' })
export class GuestProfileEntity extends BaseEntity {
  @PrimaryColumn({ name: 'guest_id', length: 45 })
  guestId: string;

  @OneToOne(() => DeviceEntity)
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @Column({ name: 'create_date' })
  @CreateDateColumn()
  createDate: Date;
}

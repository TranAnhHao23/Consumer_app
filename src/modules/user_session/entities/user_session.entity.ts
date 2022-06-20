import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';

@Entity({ name: 'user_session' })
export class UserSessionEntity extends BaseEntity {
  @PrimaryColumn({ name: 'user_session_id', length: 45 })
  @Index('idx_user_session_id')
  id: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'token', default: 'NuLL', nullable: true })
  token: string;

  @Column({ name: 'create_date', length: 45 })
  @CreateDateColumn()
  createDate: Date;

  @BeforeInsert()
  generateId() {
    const uuid = uuid4();
    const randomNumber = Math.random().toString().slice(2, 11);
    this.id = uuid + randomNumber;
  }
}

import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { DeviceEntity } from 'src/modules/device/entities/device.entity';
import * as jwt from 'jsonwebtoken';
import { AddressProfileEntity } from 'src/modules/address_profile/entities/address_profile.entity';
import { v4 as uuid4 } from 'uuid';
import { createCipher, createCipheriv, randomBytes } from 'crypto';

export enum UserStatus {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
  block = 'BLOCK',
}

@Entity({ name: 'user_profile' })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ name: 'user_id', length: 45 })
  id: string;

  @Column({ name: 'rbh_user_id', length: 45, nullable: true })
  rbhUserId: string;

  @Column({ name: 'mobile_no', length: 10, unique: true, default: '' })
  mobileNo: string;

  @Column({ unique: true, length: 320 })
  email: string;

  @Column({ name: 'password', length: 256 })
  password: string;

  @Column({ name: 'salt', length: 45, nullable: true })
  salt: string;

  @Index('idx_terms_conds')
  @Column({ name: 'term_cond_id', nullable: true })
  termCondId: string;

  @ManyToOne(() => AddressProfileEntity, (address) => address.users)
  address: AddressProfileEntity;

  @OneToOne(() => DeviceEntity)
  @JoinColumn({ name: 'device_id' })
  @Index('idx_device')
  device: DeviceEntity;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.active,
  })
  status: UserStatus;

  @Column({ name: 'create_date', nullable: true })
  @CreateDateColumn()
  createdDate: Date;

  @Column({ name: 'update_date', nullable: true })
  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ name: 'update_by', length: 45, nullable: true })
  updateBy: string;

  @BeforeInsert()
  async hashPassword() {
    //Salt Encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordBcrypt = await bcrypt.hash(this.password, salt);
    // const cipher = createCipher(
    //   'aes-256-cbc',
    //   String(process.env.AES_256_SECRET),
    // );
    // const encryptedData = Buffer.concat([
    //   cipher.update(JSON.stringify(hashedPasswordBcrypt)),
    //   cipher.final(),
    // ]);
    //
    // this.password = encryptedData.toString('hex');
    this.password = hashedPasswordBcrypt;
    this.salt = salt;
  }

  @BeforeInsert()
  generateId() {
    const uuid = uuid4();
    const randomNumber = Math.random().toString().slice(2, 11);
    this.id = uuid + randomNumber;
  }

  toResponseObject(showToken = true) {
    const { id, createdDate, email, token } = this;
    const responseData: any = { id, createdDate, email };
    if (showToken) {
      responseData.token = token;
    }
    return responseData;
  }

  async validatePassword(password: string): Promise<boolean> {
    //
    // const decipher = createCipher('aes-256-ctr', String(process.env.AES_256_SECRET));
    // const decryptedText = Buffer.concat([
    //   decipher.update(password),
    //   decipher.final(),
    // ]);
    return bcrypt.compare(password, this.password);
  }

  private get token() {
    const { id, email } = this;
    return jwt.sign(
      {
        id,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );
  }
}

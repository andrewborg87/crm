import {
  Index,
  Entity,
  Column,
  Unique,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserStatus } from '@crm/types';

import { AuthSessionEntity } from './auth-session.entity';

@Entity({ name: 'user' })
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', nullable: true })
  password?: string | null;

  @Column({ type: 'bool', default: false })
  isEmailConfirmed: boolean;

  @Column({ type: String, nullable: true })
  firstName?: string | null;

  @Column({ type: String, nullable: true })
  lastName?: string | null;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @OneToMany(() => AuthSessionEntity, (e) => e.user)
  @JoinColumn()
  authSessions: AuthSessionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

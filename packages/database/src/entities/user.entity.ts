import {
  Index,
  Entity,
  Column,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserStatus } from '@crm/types';

import { ServerEntity } from './server.entity';
import { CompanyEntity } from './company.entity';
import { AuthSessionEntity } from './auth-session.entity';
import { TradingAccountEntity } from './trading-account.entity';

@Entity({ name: 'user' })
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  firstName?: string;

  @Column({ type: 'text', nullable: true })
  middleName?: string | null;

  @Column({ type: 'text' })
  lastName: string;

  @Index()
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'bool', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'bool', default: false })
  isTermsAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt?: Date | null;

  @Column({ type: 'bool', default: false })
  isPrivacyAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  privacyAcceptedAt?: Date | null;

  @Column({ type: 'bool', default: false })
  isCookiesAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  cookiesAcceptedAt?: Date | null;

  // One-to-Many relations

  @OneToMany(() => AuthSessionEntity, (e) => e.user)
  @JoinColumn()
  authSessions: AuthSessionEntity[];

  @OneToMany(() => TradingAccountEntity, (e) => e.user)
  @JoinColumn()
  tradingAccounts: TradingAccountEntity[];

  // Many-to-One relations

  @ManyToOne(() => CompanyEntity, (e) => e.users, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => ServerEntity, (e) => e.users, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serverId' })
  server: ServerEntity;

  @Index()
  @Column({ type: 'text' })
  serverId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

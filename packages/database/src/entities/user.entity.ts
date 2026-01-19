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
import { WalletEntity } from './wallet.entity';
import { CompanyEntity } from './company.entity';
import { TradingAccountEntity } from './trading-account.entity';
import { UserAuthSessionEntity } from './user-auth-session.entity';
import { UserNotificationEntity } from './user-notifications.entity';
import { WalletTransactionEntity } from './wallet-transaction.entity';
import { WalletTransactionHistory } from './wallet_transaction_history.entity';

@Entity({ name: 'user' })
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  firstName: string;

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
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => UserAuthSessionEntity, (e) => e.user)
  @JoinColumn()
  authSessions: UserAuthSessionEntity[];

  @OneToMany(() => UserNotificationEntity, (e) => e.user)
  @JoinColumn()
  notifications: UserNotificationEntity[];

  @OneToMany(() => TradingAccountEntity, (e) => e.user)
  @JoinColumn()
  tradingAccounts: TradingAccountEntity[];

  @OneToMany(() => WalletEntity, (e) => e.user)
  @JoinColumn()
  wallets: WalletEntity[];

  @OneToMany(() => WalletTransactionEntity, (e) => e.user)
  @JoinColumn()
  walletTransactions: WalletTransactionEntity[];

  @OneToMany(() => WalletTransactionHistory, (e) => e.user)
  @JoinColumn()
  walletTransactionHistory: WalletTransactionHistory[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

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

import {
  Index,
  Entity,
  Column,
  Unique,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Platform, Monetization, TradingAccountStatus } from '@crm/types';

import { UserEntity } from './user.entity';
import { ServerEntity } from './server.entity';
import { CompanyEntity } from './company.entity';
import { UserGroupEntity } from './user-group.entity';
import { WalletTransactionEntity } from './wallet-transaction.entity';

@Entity({ name: 'trading_account' })
@Unique(['serverId', 'platformId'])
export class TradingAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  platformId: string;

  @Column({ type: 'text', nullable: true })
  platformAccountName?: string | null;

  @Column({ type: 'text', nullable: true })
  friendlyName?: string | null;

  @Index()
  @Column({ type: 'enum', enum: Platform })
  platform: Platform;

  @Index()
  @Column({ type: 'enum', enum: Monetization })
  monetization: Monetization;

  @Column({ type: 'enum', enum: TradingAccountStatus, default: TradingAccountStatus.ACTIVE })
  status: TradingAccountStatus;

  @Column({ type: 'timestamp' })
  registeredAt: Date;

  // One-to-Many relations
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => WalletTransactionEntity, (e) => e.tradingAccount)
  @JoinColumn()
  walletTransactions: WalletTransactionEntity[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.tradingAccounts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => ServerEntity, (e) => e.tradingAccounts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serverId' })
  server: ServerEntity;

  @Index()
  @Column({ type: 'text' })
  serverId: string;

  @ManyToOne(() => UserEntity, (e) => e.tradingAccounts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Index()
  @Column({ type: 'text' })
  userId: string;

  @ManyToOne(() => UserGroupEntity, (e) => e.tradingAccounts, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userGroupId' })
  userGroup: UserGroupEntity;

  @Index()
  @Column({ type: 'text' })
  userGroupId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

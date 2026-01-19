import {
  Index,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TransactionStatus, WalletTransactionType } from '@crm/types';

import { UserEntity } from './user.entity';
import { WalletEntity } from './wallet.entity';
import { CompanyEntity } from './company.entity';
import { TradingAccountEntity } from './trading-account.entity';
import { WalletTransactionHistoryEntity } from './wallet-transaction-history.entity';

@Entity({ name: 'wallet_transaction' })
export class WalletTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: WalletTransactionType })
  type: WalletTransactionType;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  // One-to-Many relations
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => WalletTransactionHistoryEntity, (e) => e.walletTransaction)
  @JoinColumn()
  history: WalletTransactionHistoryEntity[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.walletTransactions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => TradingAccountEntity, (e) => e.walletTransactions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'tradingAccountId' })
  tradingAccount?: TradingAccountEntity;

  @Index()
  @Column({ type: 'text' })
  tradingAccountId?: string | null;

  @ManyToOne(() => UserEntity, (e) => e.walletTransactions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Index()
  @Column({ type: 'text' })
  userId: string;

  @ManyToOne(() => WalletEntity, (e) => e.transactions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fromWalletId' })
  wallet: WalletEntity;

  @Index()
  @Column({ type: 'text' })
  walletId: WalletEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

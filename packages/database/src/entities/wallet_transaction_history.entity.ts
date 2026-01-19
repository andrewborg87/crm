import {
  Index,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TransactionStatus } from '@crm/types';

import { UserEntity } from './user.entity';
import { WalletEntity } from './wallet.entity';
import { CompanyEntity } from './company.entity';
import { WalletTransactionEntity } from './wallet-transaction.entity';

@Entity({ name: 'wallet_transaction_history' })
export class WalletTransactionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.walletTransactionHistory, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => UserEntity, (e) => e.walletTransactionHistory, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Index()
  @Column({ type: 'text' })
  userId: string;

  @ManyToOne(() => WalletEntity, (e) => e.transactionHistory, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fromWalletId' })
  wallet: WalletEntity;

  @Index()
  @Column({ type: 'text' })
  walletId: WalletEntity;

  @ManyToOne(() => WalletTransactionEntity, (e) => e.history, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'walletTransactionId' })
  walletTransaction: WalletTransactionEntity;

  @Index()
  @Column({ type: 'text' })
  walletTransactionId: WalletTransactionEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

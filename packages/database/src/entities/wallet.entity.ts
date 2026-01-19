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

import { AssetType } from '@crm/types';

import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';
import { WalletTransactionEntity } from './wallet-transaction.entity';
import { WalletTransactionHistory } from './wallet_transaction_history.entity';

@Entity({ name: 'wallet' })
@Unique(['userId', 'currency'])
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  friendlyName?: string | null;

  @Column({ type: 'enum', enum: AssetType })
  assetType: AssetType;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @Index()
  @Column({ type: 'varchar', length: 4 })
  currency: string; // ISO 4217 currency code

  // One-to-Many relations
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => WalletTransactionEntity, (e) => e.wallet)
  @JoinColumn()
  transactions: WalletTransactionEntity[];

  @OneToMany(() => WalletTransactionHistory, (e) => e.wallet)
  @JoinColumn()
  transactionHistory: WalletTransactionHistory[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.wallets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => UserEntity, (e) => e.wallets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Index()
  @Column({ type: 'text' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

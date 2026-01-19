import {
  Index,
  Entity,
  Column,
  Unique,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CompanyType } from '@crm/types';

import { UserEntity } from './user.entity';
import { ServerEntity } from './server.entity';
import { WalletEntity } from './wallet.entity';
import { UserGroupEntity } from './user-group.entity';
import { BillingInfoEntity } from './billing-info.entity';
import { OrganizationEntity } from './organization.entity';
import { TenantCompanyEntity } from './tenant-company.entity';
import { TradingAccountEntity } from './trading-account.entity';
import { PlatformClientEntity } from './platform-client.entity';
import { UserAuthSessionEntity } from './user-auth-session.entity';
import { UserNotificationEntity } from './user-notifications.entity';
import { WalletTransactionEntity } from './wallet-transaction.entity';
import { TenantAuthSessionEntity } from './tenant-auth-session.entity';
import { WalletTransactionHistory } from './wallet_transaction_history.entity';

@Entity({ name: 'company' })
@Unique(['domain'])
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'enum', enum: CompanyType })
  type: CompanyType;

  @Column({ type: 'text' })
  domain: string;

  // One-to-One relations
  ////////////////////////////////////////////////////////////////////

  @OneToOne(() => BillingInfoEntity, (e) => e.company, { nullable: true })
  @JoinColumn()
  billingInfo?: BillingInfoEntity | null;

  // One-to-Many relations
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => PlatformClientEntity, (e) => e.company)
  @JoinColumn()
  platformClients: PlatformClientEntity[];

  @OneToMany(() => ServerEntity, (e) => e.company)
  @JoinColumn()
  servers: ServerEntity[];

  @OneToMany(() => TenantAuthSessionEntity, (e) => e.company)
  @JoinColumn()
  tenantAuthSessions: TenantAuthSessionEntity[];

  @OneToMany(() => TenantCompanyEntity, (e) => e.company)
  @JoinColumn()
  tenantCompanies: TenantCompanyEntity[];

  @OneToMany(() => TradingAccountEntity, (e) => e.company)
  @JoinColumn()
  tradingAccounts: TradingAccountEntity[];

  @OneToMany(() => UserAuthSessionEntity, (e) => e.company)
  @JoinColumn()
  userAuthSessions: UserAuthSessionEntity[];

  @OneToMany(() => UserGroupEntity, (e) => e.company)
  @JoinColumn()
  userGroups: UserGroupEntity[];

  @OneToMany(() => UserNotificationEntity, (e) => e.company)
  @JoinColumn()
  userNotifications: UserNotificationEntity[];

  @OneToMany(() => UserEntity, (e) => e.company)
  @JoinColumn()
  users: UserEntity[];

  @OneToMany(() => WalletEntity, (e) => e.company)
  @JoinColumn()
  wallets: WalletEntity[];

  @OneToMany(() => WalletTransactionEntity, (e) => e.company)
  @JoinColumn()
  walletTransactions: WalletTransactionEntity[];

  @OneToMany(() => WalletTransactionHistory, (e) => e.company)
  @JoinColumn()
  walletTransactionHistory: WalletTransactionHistory[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => OrganizationEntity, (e) => e.companies, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  @Index()
  @Column({ type: 'text' })
  organizationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

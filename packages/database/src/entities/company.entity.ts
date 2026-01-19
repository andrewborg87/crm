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
import { UserGroupEntity } from './user-group.entity';
import { BillingInfoEntity } from './billing-info.entity';
import { AuthSessionEntity } from './auth-session.entity';
import { OrganizationEntity } from './organization.entity';
import { TenantCompanyEntity } from './tenant-company.entity';
import { TradingAccountEntity } from './trading-account.entity';

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

  @OneToOne(() => BillingInfoEntity, (e) => e.company, { nullable: true })
  @JoinColumn()
  billingInfo?: BillingInfoEntity | null;

  // One-to-Many relations

  @OneToMany(() => AuthSessionEntity, (e) => e.company)
  @JoinColumn()
  authSessions: AuthSessionEntity[];

  @OneToMany(() => ServerEntity, (e) => e.company)
  @JoinColumn()
  servers: ServerEntity[];

  @OneToMany(() => TenantCompanyEntity, (e) => e.company)
  @JoinColumn()
  tenantCompanies: TenantCompanyEntity[];

  @OneToMany(() => TradingAccountEntity, (e) => e.company)
  @JoinColumn()
  tradingAccounts: TradingAccountEntity[];

  @OneToMany(() => UserGroupEntity, (e) => e.company)
  @JoinColumn()
  userGroups: UserGroupEntity[];

  @OneToMany(() => UserEntity, (e) => e.company)
  @JoinColumn()
  users: UserEntity[];

  // Many-to-One relations

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

import {
  Index,
  Entity,
  Column,
  Unique,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CompanyType } from '@crm/types';

import { UserEntity } from './user.entity';
import { AlertEntity } from './alert.entity';
import { ServerEntity } from './server.entity';
import { ChannelEntity } from './channel.entity';
import { AuditLogEntity } from './audit-log.entity';
import { UserDetailEntity } from './user-detail.entity';
import { UserAvatarEntity } from './user-avatar.entity';
import { IntegrationEntity } from './integration.entity';
import { BillingInfoEntity } from './billing-info.entity';
import { OrganisationEntity } from './organisation.entity';
import { TenantCompanyEntity } from './tenant-company.entity';
import { UserNotification } from './user-notification.entity';
import { CompanySettingEntity } from './company-setting.entity';
import { UserAuthSessionEntity } from './user-auth-session.entity';
import { TenantAuthSessionEntity } from './tenant-auth-session.entity';
import { TradingAccountTypeEntity } from './trading-account-type.entity';
import { TradingAccountTypeLeverageEntity } from './trading-account-type-leverage.entity';

@Entity({ name: 'company' })
@Unique(['domain'])
@Unique(['name', 'type'])
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'enum', enum: CompanyType })
  type: CompanyType;

  @Column({ type: 'text' })
  domain: string;

  /** One-to-one relations */
  @OneToOne(() => BillingInfoEntity, (e) => e.company, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'billingInfoId' })
  billingInfo: BillingInfoEntity;

  @Index()
  @Column({ type: 'text' })
  billingInfoId: string;

  /** One-to-many relations */
  @OneToMany(() => AlertEntity, (e) => e.company)
  @JoinColumn()
  alerts: AlertEntity[];

  @OneToMany(() => AuditLogEntity, (e) => e.company)
  @JoinColumn()
  auditLogs: AuditLogEntity[];

  @OneToMany(() => ChannelEntity, (e) => e.company)
  @JoinColumn()
  channels: ChannelEntity[];

  @OneToMany(() => IntegrationEntity, (e) => e.company)
  @JoinColumn()
  integrations: IntegrationEntity[];

  @OneToMany(() => ServerEntity, (e) => e.company)
  @JoinColumn()
  servers: ServerEntity[];

  @OneToMany(() => CompanySettingEntity, (e) => e.company)
  @JoinColumn()
  settings: CompanySettingEntity[];

  @OneToMany(() => TenantAuthSessionEntity, (e) => e.company)
  @JoinColumn()
  tenantAuthSessions: TenantAuthSessionEntity[];

  @OneToMany(() => TenantCompanyEntity, (e) => e.company)
  @JoinColumn()
  tenantCompanies: TenantCompanyEntity[];

  @OneToMany(() => TradingAccountTypeEntity, (e) => e.company)
  @JoinColumn()
  tradingAccountTypes: TradingAccountTypeEntity[];

  @OneToMany(() => TradingAccountTypeLeverageEntity, (e) => e.company)
  @JoinColumn()
  tradingAccountTypeLeverages: TradingAccountTypeLeverageEntity[];

  @OneToMany(() => UserEntity, (e) => e.company)
  @JoinColumn()
  users: UserEntity[];

  @OneToMany(() => UserAvatarEntity, (e) => e.company)
  @JoinColumn()
  userAvatars: UserAvatarEntity[];

  @OneToMany(() => UserAuthSessionEntity, (e) => e.company)
  @JoinColumn()
  userAuthSessions: UserAuthSessionEntity[];

  @OneToMany(() => UserDetailEntity, (e) => e.company)
  @JoinColumn()
  userDetails: UserDetailEntity[];

  @OneToMany(() => UserNotification, (e) => e.company)
  @JoinColumn()
  userNotifications: UserNotification[];

  /** Many-to-one relations */
  @ManyToOne(() => OrganisationEntity, (e) => e.companies, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organisationId' })
  organisation: OrganisationEntity;

  @Index()
  @Column({ type: 'text' })
  organisationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

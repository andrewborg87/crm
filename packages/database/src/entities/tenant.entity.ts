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

import { TenantStatus } from '@crm/types';

import { AuditLogEntity } from './audit-log.entity';
import { OrganisationEntity } from './organisation.entity';
import { TenantCompanyEntity } from './tenant-company.entity';
import { TenantAuthSessionEntity } from './tenant-auth-session.entity';

@Entity({ name: 'tenant' })
@Unique(['organisationId', 'email'])
export class TenantEntity {
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

  @Index()
  @Column({ type: 'enum', enum: TenantStatus })
  status: TenantStatus;

  /** One-to-many relations */
  @OneToMany(() => AuditLogEntity, (e) => e.tenant)
  @JoinColumn()
  auditLogs: AuditLogEntity[];

  @OneToMany(() => TenantAuthSessionEntity, (e) => e.tenant)
  @JoinColumn()
  authSessions: TenantAuthSessionEntity[];

  @OneToMany(() => TenantCompanyEntity, (e) => e.tenant)
  @JoinColumn()
  tenantCompanies: TenantCompanyEntity[];

  /** Many-to-one relations */
  @ManyToOne(() => OrganisationEntity, (e) => e.tenants, {
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

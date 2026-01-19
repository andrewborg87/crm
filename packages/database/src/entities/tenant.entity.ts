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

import { OrganizationEntity } from './organization.entity';
import { TenantCompanyEntity } from './tenant-company.entity';

@Entity({ name: 'tenant' })
@Unique(['email'])
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

  @Column({ type: 'enum', enum: TenantStatus })
  status: TenantStatus;

  // One-to-Many relations

  @OneToMany(() => TenantCompanyEntity, (e) => e.company)
  @JoinColumn()
  tenantCompanies: TenantCompanyEntity[];

  // Many-to-One relations

  @ManyToOne(() => OrganizationEntity, (e) => e.tenants, {
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

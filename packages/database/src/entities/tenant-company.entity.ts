import {
  Index,
  Entity,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '@crm/types';

import { TenantEntity } from './tenant.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'tenant_company' })
@Unique(['tenantId', 'companyId'])
export class TenantCompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, array: true })
  roles: Role[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.tenantCompanies, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => TenantEntity, (e) => e.tenantCompanies, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant: TenantEntity;

  @Index()
  @Column({ type: 'text' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

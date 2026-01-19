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

import { TenantEntity } from './tenant.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'tenant_auth_session' })
@Unique(['tenantId', 'createdAt'])
export class TenantAuthSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  hash: string;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string | null;

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.tenantAuthSessions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => TenantEntity, (e) => e.authSessions, {
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

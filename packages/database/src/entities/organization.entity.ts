import {
  Entity,
  Column,
  Unique,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TenantEntity } from './tenant.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'organization' })
@Unique(['email'])
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  // One-to-Many relations
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => TenantEntity, (e) => e.organizationId)
  @JoinColumn()
  tenants: TenantEntity[];

  @OneToMany(() => CompanyEntity, (e) => e.organizationId)
  @JoinColumn()
  companies: CompanyEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

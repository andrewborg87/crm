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

@Entity({ name: 'organisation' })
@Unique(['name'])
export class OrganisationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  /** One-to-many relations */
  @OneToMany(() => CompanyEntity, (e) => e.organisation)
  @JoinColumn()
  companies: CompanyEntity[];

  @OneToMany(() => TenantEntity, (e) => e.organisation)
  @JoinColumn()
  tenants: TenantEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

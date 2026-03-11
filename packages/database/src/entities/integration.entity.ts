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

import { Integration, IntegrationType } from '@crm/types';

import { CompanyEntity } from './company.entity';

@Entity({ name: 'integration' })
@Unique(['companyId', 'name'])
export class IntegrationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Integration })
  name: Integration;

  @Index()
  @Column({ type: 'enum', enum: IntegrationType })
  type: IntegrationType;

  @Column({ type: 'boolean', default: false })
  isEnabled: boolean;

  @Column({ type: 'jsonb' })
  settings: Record<string, any>;

  @Index()
  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'varchar', length: 3, array: true, nullable: true })
  allowedCountries?: string[] | null;

  @Column({ type: 'varchar', length: 3, array: true, nullable: true })
  excludedCountries?: string[] | null;

  /** Many-to-many relations */
  @ManyToOne(() => CompanyEntity, (e) => e.integrations, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

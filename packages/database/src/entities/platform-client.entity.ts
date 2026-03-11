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

import { Platform, PlatformClientType } from '@crm/types';

import { CompanyEntity } from './company.entity';

@Entity({ name: 'platform_client' })
@Unique(['companyId', 'platform', 'type'])
export class PlatformClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Platform })
  platform: Platform;

  @Column({ type: 'enum', enum: PlatformClientType })
  type: PlatformClientType;

  @Column({ type: 'text' })
  link: string;

  /** Many-to-one relations */
  @ManyToOne(() => CompanyEntity, (e) => e.platformClients, {
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

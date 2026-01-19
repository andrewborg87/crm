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

import { Platform } from '@crm/types';

import { ServerEntity } from './server.entity';
import { CompanyEntity } from './company.entity';
import { TradingAccountEntity } from './trading-account.entity';

@Entity({ name: 'user_group' })
@Unique(['platformId', 'companyId'])
export class UserGroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  platformId: string;

  @Column({ type: 'text' })
  platformName: string;

  @Column({ type: 'enum', enum: Platform })
  platform: Platform;

  // One-to-Many relations
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => TradingAccountEntity, (e) => e.userGroup)
  @JoinColumn()
  tradingAccounts: TradingAccountEntity[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.userGroups, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => ServerEntity, (e) => e.userGroups, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serverId' })
  server: ServerEntity;

  @Index()
  @Column({ type: 'text' })
  serverId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

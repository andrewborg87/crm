import {
  Index,
  Entity,
  Unique,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Platform, Monetization, ServerStatus } from '@crm/types';

import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';
import { UserGroupEntity } from './user-group.entity';
import { TradingAccountEntity } from './trading-account.entity';

@Entity({ name: 'server' })
@Unique(['companyId', 'name'])
export class ServerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Index()
  @Column({ type: 'enum', enum: Platform })
  platform: Platform;

  @Column({ type: 'enum', enum: ServerStatus })
  status: ServerStatus;

  @Column({ type: 'enum', enum: Monetization })
  monetization: Monetization;

  @Column({ type: 'jsonb' })
  settings: Record<string, any>;

  // One-to-Many relations
  ////////////////////////////////////////////////////////////////////

  @OneToMany(() => TradingAccountEntity, (e) => e.server)
  @JoinColumn()
  tradingAccounts: TradingAccountEntity[];

  @OneToMany(() => UserGroupEntity, (e) => e.server)
  @JoinColumn()
  userGroups: UserGroupEntity[];

  @OneToMany(() => UserEntity, (e) => e.server)
  @JoinColumn()
  users: UserEntity[];

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.servers, {
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

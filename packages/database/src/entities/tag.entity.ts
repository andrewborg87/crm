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

import { CompanyEntity } from './company.entity';
import { TradingAccountTagEntity } from './trading-account-tag.entity';

@Entity({ name: 'tag' })
@Unique(['companyId', 'name'])
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  /** One-to-many relations */
  @OneToMany(() => TradingAccountTagEntity, (e) => e.tag)
  @JoinColumn()
  tradingAccountTags: TradingAccountTagEntity[];

  /** Many-to-one relations */
  @ManyToOne(() => CompanyEntity, (e) => e.tags, {
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

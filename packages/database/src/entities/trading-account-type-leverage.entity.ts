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

import { CompanyEntity } from './company.entity';
import { TradingAccountTypeEntity } from './trading-account-type.entity';

@Entity({ name: 'trading_account_type_leverage' })
@Unique(['tradingAccountTypeId', 'leverages', 'countries'])
export class TradingAccountTypeLeverageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', array: true })
  leverages: number[];

  @Column({ type: 'varchar', length: 3, array: true })
  countries: string[];

  /** Many-to-many relations */
  @ManyToOne(() => CompanyEntity, (e) => e.tradingAccountTypeLeverages, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => TradingAccountTypeEntity, (e) => e.tradingAccountTypeLeverages, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tradingAccountTypeId' })
  tradingAccountType: TradingAccountTypeEntity;

  @Index()
  @Column({ type: 'text' })
  tradingAccountTypeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

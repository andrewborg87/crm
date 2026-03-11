import { Index, Entity, Column, Unique, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

import { Period, Potency, Volatility } from '@crm/types';

@Entity({ name: 'trading_event' })
@Unique(['name', 'startAt'])
export class TradingEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Index()
  @Column({ type: 'enum', enum: Volatility })
  volatility: Volatility;

  @Column({ type: 'enum', enum: Potency, nullable: true })
  potency?: Potency | null;

  @Index()
  @Column({ type: 'enum', enum: Period, nullable: true })
  period?: Period | null;

  @Index()
  @Column({ type: 'date' })
  startAt: Date;

  @Column({ type: 'varchar', length: 3, nullable: true })
  country?: string | null;

  @Column({ type: 'varchar', length: 3, nullable: true })
  currency?: string | null;

  @Column({ type: 'float', nullable: true })
  consensus?: number | null;

  @Column({ type: 'varchar', length: 3, nullable: true })
  unit?: string | null;

  @Column({ type: 'float', nullable: true })
  actual?: number | null;

  @Column({ type: 'float', nullable: true })
  previous?: number | null;

  @Column({ type: 'boolean', default: false })
  isReport: boolean;

  @Column({ type: 'boolean', default: false })
  isSpeech: boolean;

  @Column({ type: 'boolean', default: false })
  isPreliminary: boolean;

  @Column({ type: 'boolean', default: false })
  isTradingAllowed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

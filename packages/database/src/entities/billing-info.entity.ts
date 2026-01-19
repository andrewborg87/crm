import {
  Index,
  Column,
  Entity,
  Unique,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CompanyEntity } from './company.entity';

@Entity({ name: 'billing_info' })
@Unique(['company_id'])
export class BillingInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  addressLine1: string;

  @Column({ type: 'text', nullable: true })
  addressLine2?: string | null;

  @Column({ type: 'text' })
  city: string;

  @Column({ type: 'text' })
  postCode: string;

  @Column({ type: 'text', nullable: true })
  state?: string | null;

  @Column({ type: 'varchar', length: 2 })
  country: string;

  @Column({ type: 'text', nullable: true })
  vatId?: string | null;

  // One-to-One relations
  ////////////////////////////////////////////////////////////////////

  @OneToOne(() => CompanyEntity, (e) => e.billingInfo, {
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

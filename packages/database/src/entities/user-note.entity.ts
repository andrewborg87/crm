import {
  Index,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { TenantEntity } from './tenant.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'user_note' })
export class UserNoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'text' })
  body: string;

  @Index()
  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  /** Many-to-one relations */
  @ManyToOne(() => TenantEntity, (e) => e.userNotes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: TenantEntity;

  @Index()
  @Column({ type: 'text' })
  authorId: string;

  @ManyToOne(() => CompanyEntity, (e) => e.userNotes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => UserEntity, (e) => e.notes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Index()
  @Column({ type: 'text' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

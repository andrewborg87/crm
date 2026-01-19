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

import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';

@Entity({ name: 'user_auth_session' })
@Unique(['userId', 'createdAt'])
export class UserAuthSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  hash: string;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string | null;

  // Many-to-One relations
  ////////////////////////////////////////////////////////////////////

  @ManyToOne(() => CompanyEntity, (e) => e.userAuthSessions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Index()
  @Column({ type: 'text' })
  companyId: string;

  @ManyToOne(() => UserEntity, (e) => e.authSessions, {
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

import {
  Index,
  Entity,
  Column,
  Unique,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserStatus } from '@crm/types';

import { CompanyEntity } from './company.entity';
import { UserNoteEntity } from './user-note.entity';
import { UserAvatarEntity } from './user-avatar.entity';
import { UserDetailEntity } from './user-detail.entity';
import { UserSettingEntity } from './user-setting.entity';
import { UserDocumentEntity } from './user-document.entity';
import { UserNotification } from './user-notification.entity';
import { TradingAccountEntity } from './trading-account.entity';
import { UserAuthSessionEntity } from './user-auth-session.entity';

@Entity({ name: 'user' })
@Unique(['detailId'])
@Unique(['settingsId'])
@Unique(['email', 'companyId'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text', nullable: true })
  middleName?: string | null;

  @Column({ type: 'text' })
  lastName: string;

  @Index()
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'varchar' })
  securityPin: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'bool', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'bool', default: false })
  isTermsAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt?: Date | null;

  @Column({ type: 'bool', default: false })
  isPrivacyAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  privacyAcceptedAt?: Date | null;

  @Column({ type: 'bool', default: false })
  isCookiesAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  cookiesAcceptedAt?: Date | null;

  /** One-to-one relations */
  @OneToOne(() => UserAvatarEntity, (e) => e.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'avatarId' })
  avatar?: UserAvatarEntity | null;

  @Index()
  @Column({ type: 'text', nullable: true })
  avatarId?: string | null;

  @OneToOne(() => UserDetailEntity, (e) => e.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userDetailId' })
  detail?: UserDetailEntity | null;

  @Index()
  @Column({ type: 'text', nullable: true })
  detailId?: string | null;

  @OneToOne(() => UserSettingEntity, (e) => e.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'settingsId' })
  settings: UserSettingEntity;

  @Index()
  @Column({ type: 'text' })
  settingsId: string;

  /** One-to-many relations */
  @OneToMany(() => UserAuthSessionEntity, (e) => e.user)
  @JoinColumn()
  authSessions: UserAuthSessionEntity[];

  @OneToMany(() => UserDocumentEntity, (e) => e.user)
  @JoinColumn()
  documents: UserDocumentEntity[];

  @OneToMany(() => UserNoteEntity, (e) => e.user)
  @JoinColumn()
  notes: UserNoteEntity[];

  @OneToMany(() => UserNotification, (e) => e.user)
  @JoinColumn()
  notifications: UserNotification[];

  @OneToMany(() => TradingAccountEntity, (e) => e.user)
  @JoinColumn()
  tradingAccounts: TradingAccountEntity[];

  /** Many-to-one relations */
  @ManyToOne(() => CompanyEntity, (e) => e.users, {
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

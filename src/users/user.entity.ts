import { Note } from 'src/notes/note.entity';
// import { PrivateContact } from 'src/private-contacts/private-contact.entity';
import { UserInfo } from 'src/user-info/user-info.entity';
import { UserSecurityQuestion } from 'src/admin/users-security-questions/user-security-question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  password?: string;

  @Column({ default: '' })
  name?: string;

  @Column({ default: '' })
  deviceId?: string;

  @Column({ default: '' })
  deviceToken?: string;

  @Column({ default: '' })
  deviceType?: string;

  @Column({ default: '' })
  username?: string;

  @Column({ default: '' })
  email?: string;

  @Column({ default: '' })
  phone_number?: string;

  @Column({ default: '' })
  status?: string;

  @Column({ default: '' })
  otp: string;

  @Column({ default: false })
  isPasscode: boolean;

  @Column({ default: false })
  isLoggedIn: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user) // specify inverse side as a second parameter
  @JoinColumn()
  userInfo: UserInfo;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  // @OneToMany(() => PrivateContact, (privateContact) => privateContact.user)
  // privateContacts: PrivateContact[];

  @OneToMany(
    () => UserSecurityQuestion,
    (userSecurityQuestion) => userSecurityQuestion.user,
  )
  userSecurityQuestions: UserSecurityQuestion[];
}

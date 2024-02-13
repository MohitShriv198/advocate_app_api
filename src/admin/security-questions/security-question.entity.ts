import { UserSecurityQuestion } from 'src/admin/users-security-questions/user-security-question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SecurityQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  type: number; // 1 for Questions1 part and 2 for Questions2 part

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => UserSecurityQuestion,
    (userSecurityQuestion) => userSecurityQuestion.securityQuestion,
  )
  securityQuestionAnswers: UserSecurityQuestion[];
}

import { SecurityQuestion } from 'src/admin/security-questions/security-question.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserSecurityQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.userSecurityQuestions)
  user: User

  @ManyToOne(() => SecurityQuestion, (securityQuestion) => securityQuestion.securityQuestionAnswers)
  securityQuestion: SecurityQuestion
}

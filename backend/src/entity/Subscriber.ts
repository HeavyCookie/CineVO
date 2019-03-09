import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ unique: true })
  public email: string

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date
}

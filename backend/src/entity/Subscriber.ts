import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Subscriber {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Field()
  @Column({ unique: true })
  public email: string

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date
}

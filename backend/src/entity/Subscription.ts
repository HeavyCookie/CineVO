import { ObjectType, Field } from 'type-graphql'
import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm'

import { Theater } from './Theater'
import { User } from './User'

@ObjectType()
@Entity()
export class Subscription extends BaseEntity {
  @Field()
  @PrimaryColumn('uuid')
  public userId: string

  @Field()
  @PrimaryColumn('uuid')
  public theaterId: string

  @ManyToOne(
    () => User,
    user => user.subscriptions
  )
  public user: User

  @Field(() => Theater)
  @ManyToOne(
    () => Theater,
    theater => theater.subscriptions
  )
  public theater: Theater

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date
}

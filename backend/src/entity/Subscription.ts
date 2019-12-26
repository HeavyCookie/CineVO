import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm'
import { ObjectType, Field } from 'type-graphql'

import { User } from './User'
import { Theater } from './Theater'

@ObjectType()
@Entity()
export class Subscription {
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

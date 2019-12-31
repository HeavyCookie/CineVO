import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

import { Subscription } from './Subscription'

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Field()
  @Column({ unique: true })
  public email: string

  public password: string

  @Column()
  public passwordHash: string

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date

  @OneToMany(
    () => Subscription,
    subscription => subscription.user,
    { onDelete: 'CASCADE' }
  )
  public subscriptions: Subscription[]

  @Column({ nullable: true, unique: true, type: 'uuid' })
  public resetPasswordToken: string

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date
}
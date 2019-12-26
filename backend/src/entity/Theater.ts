import { Field, ObjectType } from 'type-graphql'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import { Screening } from './Screening'
import { Subscription } from './Subscription'

@ObjectType()
@Entity()
export class Theater {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Field()
  @Column({ unique: true })
  public allocineCode: string

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date

  @Field()
  @Column()
  public name: string

  @Field()
  @Column()
  public street: string

  @Field()
  @Column()
  public postcode: number

  @Field()
  @Column()
  public city: string

  @OneToMany(
    () => Screening,
    screening => screening.theater
  )
  public screenings: Screening[]

  @OneToMany(
    () => Subscription,
    subscription => subscription.theater
  )
  public subscriptions: Promise<Subscription[]>
}

import { Field, ObjectType } from 'type-graphql'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm'

import { Indexable, Indexed } from '../lib/elastic-search/index'

import { Screening } from './Screening'
import { Subscription } from './Subscription'

@ObjectType()
@Entity()
@Indexable()
export class Theater extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  @Indexed('text')
  public id: string

  @Field()
  @Column({ unique: true })
  @Indexed('text')
  public allocineCode: string

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  @Indexed('date')
  public createdAt: Date

  @Field()
  @Column()
  @Indexed('text')
  public name: string

  @Field()
  @Column()
  @Indexed('text')
  public street: string

  @Field()
  @Column()
  @Indexed('text')
  public postcode: number

  @Field()
  @Column()
  @Indexed('text')
  public city: string

  @Column({ type: 'jsonb', nullable: true })
  @Indexed('geo_point')
  public location?: { lat: number; lon: number }

  @Field(() => [Screening])
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

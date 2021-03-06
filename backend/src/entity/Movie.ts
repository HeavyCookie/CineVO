import { ObjectType, Field, ID, Int } from 'type-graphql'
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm'

import { getFileURL } from '@/config/file-storage'

import { Screening } from './Screening'

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ unique: true })
  public allocineId: number

  @Column({ unique: true, nullable: true })
  public tmdbId?: number

  @Field()
  @Column()
  public title: string

  @Field(() => Int, { description: 'Duration of the movie in seconds' })
  @Column()
  public runtime: number

  @Field(() => Date)
  @Column()
  public release: Date

  @Field({ nullable: true })
  @Column({ nullable: true })
  public plot?: string

  @Field(() => [String])
  @Column({ type: 'varchar', array: true, default: () => "'{}'" })
  public actors: string[]

  @Field(() => [String])
  @Column({ type: 'varchar', array: true, default: () => "'{}'" })
  public directors: string[]

  @Column({ nullable: true })
  public poster?: string

  @Field(() => String, { name: 'poster', nullable: true })
  public posterUrl(): string | null {
    return this.poster ? getFileURL(this.poster) : null
  }

  @Column({ nullable: true })
  public backdrop?: string

  @Field(() => String, { name: 'backdrop', nullable: true })
  public backdropUrl(): string | null {
    return this.backdrop ? getFileURL(this.backdrop) : null
  }

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  public pressRatings?: number

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  public userRatings?: number

  @Field(() => [Screening])
  @OneToMany(
    () => Screening,
    screening => screening.movie,
    { cascade: true }
  )
  public screenings: Promise<Screening[]>
}

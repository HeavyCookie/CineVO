import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, ID, Int } from 'type-graphql'
import { Screening } from './Screening'

@ObjectType()
@Entity()
export class Movie {
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  public poster?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  public backdrop?: string

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  public pressRatings?: number

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  public userRatings?: number

  @Field(() => [Screening])
  @OneToMany(() => Screening, screening => screening.movie)
  public screenings: Promise<Screening[]>
}

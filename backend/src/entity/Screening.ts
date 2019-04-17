import { ObjectType, Field } from 'type-graphql'
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Movie } from './Movie'

@ObjectType()
@Entity()
export class Screening {
  @PrimaryColumn({ type: 'timestamptz' })
  public date: Date

  @Field(() => String, { name: 'date' })
  public get dateToString() {
    return this.date.toISOString()
  }

  @PrimaryColumn()
  public movieId: number

  @Field(() => Movie)
  @ManyToOne(() => Movie, { nullable: false })
  public movie: Movie
}

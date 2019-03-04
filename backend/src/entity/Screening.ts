import { ObjectType, Field } from 'type-graphql'
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Movie } from './Movie'

@ObjectType()
@Entity()
export class Screening {
  @Field()
  @PrimaryColumn({ type: 'timestamptz' })
  public date: Date

  @PrimaryColumn()
  public movieId: number

  @Field(() => Movie)
  @ManyToOne(() => Movie, { nullable: false })
  public movie: Movie
}

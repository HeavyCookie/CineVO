import { Resolver, Mutation, Arg, InputType, Field, ID } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { IsEmail } from 'class-validator'

import { Subscriber } from '../entity/Subscriber'

@InputType()
class SubscriberInput {
  @Field({ nullable: true })
  public id: string

  @IsEmail()
  @Field()
  public email: string

  @Field({ nullable: true })
  public createdAt: Date
}

@Resolver()
export class SubscriberResolver {
  public constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>
  ) {}

  @Mutation(() => Boolean)
  public async subscribe(@Arg('subscriber') input: SubscriberInput) {
    try {
      await this.subscriberRepository.insert(input)
      return true
    } catch {
      return false
    }
  }

  @Mutation(() => Subscriber)
  public async unsubscribe(@Arg('id', () => ID) id: string) {
    const subscriber = await this.subscriberRepository.findOneOrFail({ id })
    await this.subscriberRepository.delete({ id })
    return subscriber
  }
}

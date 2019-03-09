import { Resolver, Mutation, Arg, InputType, Field, ID } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { IsEmail } from 'class-validator'
import { Subscriber } from '../entity/Subscriber'

@InputType()
class SubscriberInput {
  @IsEmail()
  @Field()
  public email: string
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
      await this.subscriberRepository.insert({ email: input.email })
      return true
    } catch {
      return false
    }
  }

  @Mutation(() => Boolean)
  public async unsubscribe(@Arg('email', () => String) email: string) {
    try {
      await this.subscriberRepository.delete({ email })
      return true
    } catch {
      return false
    }
  }
}

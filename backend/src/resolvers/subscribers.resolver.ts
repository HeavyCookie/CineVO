import { Resolver, Mutation, Arg } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Subscriber } from '../entity/Subscriber'

@Resolver()
export class SubscriberResolver {
  public constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>
  ) {}

  @Mutation(() => Boolean)
  public async subscribe(@Arg('email', () => String) email: string) {
    try {
      await this.subscriberRepository.insert({ email })
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

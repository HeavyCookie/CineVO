import {
  Resolver,
  Mutation,
  Authorized,
  Arg,
  ID,
  Query,
  FieldResolver,
  Root,
} from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Subscription } from '@/entity/Subscription'
import { User } from '@/entity/User'
import { CurrentUser } from '@/lib/Context'
import { Theater } from '@/mails/newsletter/Theater'
import { SubscriptionRepository } from '@/repositories/SubscriptionRepository'
import { TheaterRepository } from '@/repositories/TheaterRepository'

@Resolver(Subscription)
export class SubscriptionResolver {
  public constructor(
    @InjectRepository(SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
    @InjectRepository(TheaterRepository)
    private readonly theaterRepository: TheaterRepository
  ) {}

  @FieldResolver(() => Theater)
  public async theater(@Root() subscription: Subscription) {
    return this.theaterRepository.findOne({
      id: subscription.theaterId,
    })
  }

  @Query(() => [Subscription])
  @Authorized()
  public async subscriptions(@CurrentUser() currentUser: User) {
    await this.subscriptionRepository.find({ userId: currentUser.id })
  }

  @Query(() => Boolean)
  @Authorized()
  public async isSubscribed(
    @CurrentUser() currentUser: User,
    @Arg('theaterId', () => ID) theaterId: string
  ) {
    return (
      (await this.subscriptionRepository.count({
        userId: currentUser.id,
        theaterId: theaterId,
      })) == 1
    )
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async addSubscription(
    @Arg('theaterId', () => ID) theaterId: string,
    @CurrentUser() currentUser: User
  ) {
    this.subscriptionRepository.save({ user: currentUser, theaterId })
    return true
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async removeSubscription(
    @Arg('theaterId', () => ID) theaterId: string,
    @CurrentUser() currentUser: User
  ) {
    await this.subscriptionRepository.delete({
      userId: currentUser.id,
      theaterId,
    })
    return true
  }
}

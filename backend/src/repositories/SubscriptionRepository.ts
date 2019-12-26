import { Repository, EntityRepository } from 'typeorm'

import { Subscription } from '../entity/Subscription'

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {}

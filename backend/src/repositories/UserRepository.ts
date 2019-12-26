import { Repository, EntityRepository } from 'typeorm'

import { User } from '../entity/User'
import { generatePasswordHash } from '../lib/security'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findOrCreate(email: string) {
    const existingUser = await this.findOne({ email })
    if (existingUser) return existingUser

    const password = await generatePasswordHash()

    const user = this.create({
      email,
      passwordHash: password,
    })
    return await this.save(user, { reload: true })
  }

  public getUserForNewsletter(start: Date, end: Date) {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.subscriptions', 'subscription')
      .leftJoinAndSelect('subscription.theater', 'theater')
      .leftJoinAndSelect('theater.screenings', 'screening')
      .leftJoinAndSelect('screening.movie', 'movie')
      .where('screening.date > :start AND screening.date < :end', {
        start,
        end,
      })
  }
}

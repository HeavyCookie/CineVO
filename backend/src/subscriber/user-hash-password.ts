import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'

import { User } from '../entity/User'
import { generatePasswordHash } from '../lib/security'

@EventSubscriber()
export class UserHashPassword implements EntitySubscriberInterface {
  public listenTo = () => User

  private async hashPasswordIfPresent(entity: User) {
    if (!entity.password) return

    entity.passwordHash = await generatePasswordHash(entity.password)
  }

  public async beforeInsert(event: InsertEvent<User>) {
    await this.hashPasswordIfPresent(event.entity)
  }

  public async beforeUpdate(event: UpdateEvent<User>) {
    await this.hashPasswordIfPresent(event.entity)
  }
}

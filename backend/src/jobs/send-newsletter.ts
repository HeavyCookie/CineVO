import { schedule } from 'node-cron'
import { getCustomRepository } from 'typeorm'

import { htmlNewsletter } from '../lib/newsletter'
import { getWeek } from '../lib/theater-weeks'
import { sendMail } from '../config/mailer'
import { UserRepository } from '../repositories/UserRepository'

export const sendNewsletter = async () => {
  const [start, end] = getWeek(0)

  const subscribers = await getCustomRepository(UserRepository)
    .createQueryBuilder()
    .getMany()

  console.log(`Sending newsletter to ${subscribers.length} people`)

  subscribers.forEach(async subscriber => {
    const user = await getCustomRepository(UserRepository)
      .getUserForNewsletter(start, end)
      .andWhere('user.id = :id', { id: subscriber.id })
      .getOne()

    if (!user || user.subscriptions.length == 0)
      return console.info('No movie this week')

    await sendMail(
      subscriber.email,
      'Séances de la semaine',
      await htmlNewsletter(user, [start, end])
    )
  })
}

schedule('0 0 5 * * 3', sendNewsletter)

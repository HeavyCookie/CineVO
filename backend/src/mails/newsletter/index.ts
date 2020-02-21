require('dotenv').config({ path: '../.env' })

import Koa from 'koa'
import { createConnection, getCustomRepository, getConnection } from 'typeorm'

import { htmlNewsletter } from '../../lib/newsletter'
import { getWeek } from '../../lib/theater-weeks'
import { UserRepository } from '../../repositories/UserRepository'

const app = new Koa()

app.use(async ctx => {
  try {
    await getConnection()
  } catch {
    await createConnection()
  }

  const [start, end] = getWeek(0)

  const user = await getCustomRepository(UserRepository)
    .getUserForNewsletter(start, end)
    .getOne()

  if (!user) throw new Error('No user')

  ctx.body = await htmlNewsletter(user, [start, end])
})

console.log('http://localhost:3333')
app.listen(3333)

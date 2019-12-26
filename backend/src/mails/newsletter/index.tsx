require('dotenv').config({ path: '../.env' })

import * as Koa from 'koa'
import {
  createConnection,
  getCustomRepository,
  getConnection,
  getRepository,
} from 'typeorm'

import { htmlNewsletter } from '../../lib/newsletter'
import { MovieRepository } from '../../repositories/MovieRepository'
import { getWeek } from '../../lib/theater-weeks'
import { User } from '../../entity/User'
import { Theater } from '../../entity/Theater'
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

  ctx.body = await htmlNewsletter(user, [start, end])
})

console.log('http://localhost:3333')
app.listen(3333)

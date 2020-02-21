import AdminBro from 'admin-bro'
import { Database, Resource } from 'admin-bro-typeorm'
import { validate } from 'class-validator'
import { Connection } from 'typeorm'

import { Movie } from '@/entity/Movie'
import { Screening } from '@/entity/Screening'
import { Subscription } from '@/entity/Subscription'
import { Theater } from '@/entity/Theater'
import { User } from '@/entity/User'
import { checkPassword } from '@/lib/security'

export const adminBro = (connection: Connection) => {
  Resource.validate = validate
  AdminBro.registerAdapter({ Database, Resource })

  Theater.useConnection(connection)
  Movie.useConnection(connection)
  Screening.useConnection(connection)
  Subscription.useConnection(connection)
  User.useConnection(connection)

  return new AdminBro({
    branding: {
      companyName: 'CineVO',
    },
    resources: [
      {
        resource: Theater,
        options: { parent: { name: 'CineVO' }, name: 'Theaters' },
      },
      {
        resource: Movie,
        options: { parent: { name: 'CineVO' }, name: 'Movies' },
      },
      {
        resource: Screening,
        options: { parent: { name: 'CineVO' }, name: 'Screening' },
      },
      {
        resource: Subscription,
        options: { parent: { name: 'CineVO' }, name: 'Subscriptions' },
      },
      {
        resource: User,
        options: { parent: { name: 'CineVO' }, name: 'Users' },
      },
    ],
    rootPath: '/admin',
  })
}

export const authentication = async (email: string, password: string) => {
  const user = await User.findOne({ email, isAdmin: true })
  if (user) {
    const matched = await checkPassword(user.passwordHash, password)
    if (matched) {
      return user
    }
  }
  return false
}

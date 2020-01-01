import AdminBro from 'admin-bro'
import { Database, Resource } from 'admin-bro-typeorm'
import { validate } from 'class-validator'
import { Connection } from 'typeorm'

import { Theater } from '../entity/Theater'
import { Movie } from '../entity/Movie'
import { Screening } from '../entity/Screening'
import { Subscription } from '../entity/Subscription'
import { User } from '../entity/User'

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

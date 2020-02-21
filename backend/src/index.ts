require('dotenv').config({ path: '../.env' })

import 'reflect-metadata'
import { buildAuthenticatedRouter } from 'admin-bro-expressjs'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import jwt from 'express-jwt'
import * as TypeORM from 'typeorm'

import { adminBro, authentication } from '@/config/admin-bro'
import { generateSchema } from '@/config/graphql-schema'
import { context } from '@/lib/Context'
import '@/jobs'

const { PORT = 4000, SESSION_KEY } = process.env

async function start() {
  if (!SESSION_KEY) throw new Error('SESSION_KEY undefined')
  const connection = await TypeORM.createConnection()

  const app = express()

  const adminBroConfig = adminBro(connection)

  app.use(
    adminBroConfig.options.rootPath,
    buildAuthenticatedRouter(adminBroConfig, {
      authenticate: authentication,
      cookiePassword: SESSION_KEY,
    })
  )

  app.use('/', jwt({ secret: SESSION_KEY, credentialsRequired: false }))

  const server = new ApolloServer({
    schema: await generateSchema(),
    context,
    playground: process.env.NODE_ENV != 'production',
    tracing: process.env.NODE_ENV != 'production',
  })

  server.applyMiddleware({ app, path: '/' })

  // Start the server
  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  )
}

start()

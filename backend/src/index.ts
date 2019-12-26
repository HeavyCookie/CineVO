require('dotenv').config({ path: '../.env' })

import 'reflect-metadata'
import * as TypeORM from 'typeorm'
import { ApolloServer } from 'apollo-server-express'
import * as express from 'express'
import * as jwt from 'express-jwt'

import { generateSchema } from './config/graphql-schema'
import { context } from './lib/Context'

const { PORT = 4000, SESSION_KEY } = process.env

async function start() {
  await TypeORM.createConnection()

  const app = express()
  app.use('/', jwt({ secret: SESSION_KEY, credentialsRequired: false }))

  const server = new ApolloServer({
    schema: await generateSchema(),
    context,
    playground: true,
    tracing: true,
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

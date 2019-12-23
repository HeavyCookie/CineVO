require('dotenv').config({ path: '../.env' })

import 'reflect-metadata'
import * as TypeORM from 'typeorm'
import { ApolloServer } from 'apollo-server'

import { generateSchema } from './config/graphql-schema'

const PORT = process.env.PORT || 4000

async function start() {
  await TypeORM.createConnection()

  const server = new ApolloServer({
    schema: await generateSchema(),
    playground: true,
    tracing: true,
  })

  // Start the server
  const { url } = await server.listen(PORT)
  console.info(`Server is running, GraphQL Playground available at ${url}`)
}

start()

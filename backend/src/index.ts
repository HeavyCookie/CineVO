import 'reflect-metadata'
import { resolve } from 'path'
import { Container } from 'typedi'
import * as TypeORM from 'typeorm'
import { ApolloServer } from 'apollo-server'
import * as TypeGraphQL from 'type-graphql'

const PORT = process.env.PORT || 4000

TypeGraphQL.useContainer(Container);
TypeORM.useContainer(Container)

async function start() {
  await TypeORM.createConnection()

  const schema = await TypeGraphQL.buildSchema({
    resolvers: [__dirname + '/**/*.resolver.ts'],
    emitSchemaFile: resolve(__dirname, '..', 'schema.gql'),
  })

  const server = new ApolloServer({
    schema,
    playground: true,
  })

  // Start the server
  const { url } = await server.listen(PORT)
  console.info(`Server is running, GraphQL Playground available at ${url}`)
}

start()

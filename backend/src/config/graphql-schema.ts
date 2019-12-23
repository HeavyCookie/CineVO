import { resolve } from 'path'

import { buildSchema } from 'type-graphql'
import Container from 'typedi'
import { useContainer } from 'typeorm'

import { Logs } from '../middlewares/logs'

useContainer(Container)

export const generateSchema = () =>
  buildSchema({
    resolvers: [__dirname + '/../**/*.resolver.ts'],
    emitSchemaFile: resolve(__dirname, '..', '..', 'schema.gql'),
    globalMiddlewares: [Logs],
    container: Container,
  })

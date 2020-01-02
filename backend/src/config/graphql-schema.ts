import { resolve } from 'path'

import { buildSchema } from 'type-graphql'
import Container from 'typedi'
import { useContainer } from 'typeorm'

import { Logs } from '../middlewares/logs'
import { authChecker } from '../lib/Context'

useContainer(Container)

export const generateSchema = () =>
  buildSchema({
    resolvers: [__dirname + '/../**/*.resolver.ts'],
    emitSchemaFile: resolve(
      __dirname,
      '..',
      '..',
      '..',
      'frontend',
      'schema.gql'
    ),
    globalMiddlewares: [Logs],
    container: Container,
    authChecker,
    authMode: 'null',
  })

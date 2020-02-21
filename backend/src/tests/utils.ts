require('dotenv').config({ path: '../.env' })

import { GraphQLSchema, graphql, DocumentNode } from 'graphql'
import {
  getConnectionOptions,
  createConnection,
  Connection,
  ConnectionOptions,
} from 'typeorm'

import { generateSchema } from '@/config/graphql-schema'

let connection: Connection

export const connect = async () => {
  if (!connection) {
    const originalOptions = await getConnectionOptions()
    const options: ConnectionOptions = {
      ...originalOptions,
      type: 'postgres', // set to avoid interface errors on `createConnection`
      dropSchema: true,
      synchronize: true,
      logging: false,
      database: originalOptions.database + '_test',
    }
    connection = await createConnection(options)
    await connection.dropDatabase()
    await connection.synchronize(true)
  }

  return connection
}

export const disconnect = () => connection && connection.close()

let schema: GraphQLSchema
export const query = async (
  q: DocumentNode,
  variableValues?:
    | undefined
    | null
    | {
        [key: string]: any
      }
) => {
  if (!schema) schema = await generateSchema()
  if (!q?.loc) throw new Error('unable to get loc')
  return graphql({
    schema,
    source: q.loc.source.body,
    variableValues,
  })
}

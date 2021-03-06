require('dotenv').config({ path: '../.env' })

const { resolve } = require('path') // eslint-disable-line @typescript-eslint/no-var-requires

const {
  POSTGRES_HOST = 'localhost',
  POSTGRES_PORT = '5432',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD,
  POSTGRES_DB = 'cinevo',
} = process.env

module.exports = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  logging: true,
  entities: [resolve(__dirname, 'src/entity/**/!(*.test.ts)')],
  migrations: [resolve(__dirname, 'src/migration/**/!(*.test.ts)')],
  subscribers: [resolve(__dirname, 'src/subscriber/**/!(*.test.ts)')],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
}

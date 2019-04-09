require('dotenv').config({ path: '../.env' })

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
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
}

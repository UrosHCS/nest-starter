// This file is used just for CLI applications like:
// npm run typeorm schema:sync

// It is not loaded in the nest application.
// Check src/conf/config.ts, database key.

// We use dotenv here so we can take env variables from
// .env file, like we do in the nest application. This
// way we don't have to specify configuration twice.
require('dotenv').config({
  path: '.env',
})

const config = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: ['src/**/*entity.ts'],
}

// Here you can console log config to make sure the env variables are ok

module.exports = config

export default () => ({
  /**
   * Database settings
   */
  database: {
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    keepConnectionAlive: false,
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    logging: Boolean(process.env.DB_LOGGING),

    // This allows us to automatically load entities
    // when we register repositories. This is a nestjs
    // feature, not a typeorm feature.
    autoLoadEntities: true,
  },
})

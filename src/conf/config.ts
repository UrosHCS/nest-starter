export default () => {
  const config = {
    /**
     * Json Web Token settings
     */
    jwt: {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    },

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
      // keepConnectionAlive: true,
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
      logging: Boolean(process.env.DB_LOGGING),

      entities: [
        process.env.RUNTIME_LANGUAGE === 'ts'
          ? // Use ts files in src
            'src/database/entities/*.ts'
          : // Build files are in the dist directory so we need to point there
            // to find the entities when running the app.
            'dist/src/database/entities/*.js',
      ],
    },
  }
  // console.log(config)

  return config
}

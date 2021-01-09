import { User } from "src/database/entities/user.entity"

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
        // Instead of specifying a regex to find all entities, add them manually.
        // This avoids an error with mixing require() and ESM.
        User,
      ],
    },
  }
  // console.log(config)

  return config
}

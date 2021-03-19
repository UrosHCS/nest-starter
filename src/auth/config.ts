export default () => ({
  /**
   * Json Web Token settings
   */
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  },

  /**
   * Google auth settings
   */
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
  },

  /**
   * Facebook auth settings
   */
  facebook: {},
})

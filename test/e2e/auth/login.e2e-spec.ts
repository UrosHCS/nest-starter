import { after, before, ctx } from "../ctx.js"

describe('LogIn', () => {
  beforeEach(before)

  it('logs in if credentials are valid', async () => {
    const user = await ctx.createUser()

    return ctx.request
      .post('/login')
      .send({ email: user.email, password: 'password' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('token')
        expect(res.body.data.token).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        expect(res.body.data).toHaveProperty('user.email', user.email)
        expect(res.body.data).toHaveProperty('user.role', user.role)
        expect(res.body.data).not.toHaveProperty('user.password')
      })
  })

  it('returns 401 if credentials are invalid', async () => {
    const user = await ctx.createUser()

    return ctx.request
      .post('/login')
      .send({
        email: user.email,
        password: 'not the right password',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Wrong password',
        })
      })
  })

  afterEach(after)
})

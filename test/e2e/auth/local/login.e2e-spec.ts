import { after, before, ctx } from 'test/e2e/ctx'
import { patterns } from 'test/helpers/regex'

describe('LogIn', () => {
  beforeEach(before)

  it('logs in if credentials are valid', async () => {
    const user = await ctx.createUser()

    const res = await ctx.request
      .post('/login')
      .send({ email: user.email, password: 'password' })
      .expect(200)
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data.token).toMatch(patterns.jwt)
    expect(res.body.data).toHaveProperty('user.email', user.email)
    expect(res.body.data).toHaveProperty('user.role', user.role)
    expect(res.body.data).not.toHaveProperty('user.password')
  })

  it('returns 401 if credentials are invalid', async () => {
    const user = await ctx.createUser()

    const res = await ctx.request
      .post('/login')
      .send({
        email: user.email,
        password: 'not the right password',
      })
      .expect(401)
    expect(res.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Wrong password',
    })
  })

  afterEach(after)
})

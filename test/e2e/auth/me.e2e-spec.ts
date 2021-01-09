import { after, before, ctx } from "../ctx"

describe('Get logged in user', () => {
  beforeEach(before)

  it('declines malformed JWT', async () => {
    const { user, token } = await ctx.logIn()

    const parts = token.split('.')

    const malformedToken = [parts[0] + 'bad', parts[1], parts[2]].join('.')

    return ctx.request
      .get('/me')
      .set('Authorization', 'Bearer ' + malformedToken)
      .expect(401)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          statusCode: 401,
          message: 'Unauthorized',
        })
      })
  })

  it('returns logged in user', async () => {
    const { user, token } = await ctx.logIn()

    return ctx.request
      .get('/me')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toStrictEqual({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        })
      })
  })

  afterEach(after)
})

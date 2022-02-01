import { assert } from 'console'
import * as test from 'japa'
import { TokenService } from 'src/auth/services/token.service'
import { after, before, ctx } from 'test/e2e/ctx'

test.group('Get logged in user', (group) => {
  group.beforeEach(before)

  let cases: Array<(token: string) => string> = [
    // concat 'bad' to signature part
    (token) => {
      const [header, payload, signature] = token.split('.')

      return [header, payload, signature + 'bad'].join('.')
    },
    // replace last character in signature by '3'

    (token) => {
      const [header, payload, signature] = token.split('.')

      return [header, payload, signature.slice(0, -1) + '3'].join('.')
    },

    // remove last character from signature

    (token) => {
      const [header, payload, signature] = token.split('.')

      return [header + 'bad', payload, signature.slice(0, -1)].join('.')
    },
  ]

  cases.forEach((generateMalformedToken) => {
    test('declines malformed JWT', async (assert) => {
      const user = await ctx.createUser()

      const token = await ctx.app.get(TokenService).makeToken(user)

      const malformedToken = generateMalformedToken(token)

      const res = await ctx.request
        .get('/me')
        .set('Authorization', 'Bearer ' + malformedToken)
        .expect(401)
      assert.deepStrictEqual(res.body, {
        statusCode: 401,
        message: 'Unauthorized',
      })
    })
  })

  test('returns logged in user', async (assert) => {
    const user = await ctx.logIn()

    const res = await ctx.request.get('/me').expect(200)
    assert.deepStrictEqual(res.body.data, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  })

  group.afterEach(after)
})

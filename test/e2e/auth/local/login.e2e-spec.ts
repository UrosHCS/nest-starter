import * as test from 'japa'
import { after, before, ctx } from 'test/e2e/ctx'
import { patterns } from 'test/helpers/regex'

test.group('LogIn', (group) => {
  group.beforeEach(before)

  test('logs in if credentials are valid', async (assert) => {
    const user = await ctx.createUser()

    const res = await ctx.request
      .post('/login')
      .send({ email: user.email, password: 'password' })
      .expect(200)

    assert.property(res.body.data, 'token')
    assert.match(res.body.data.token, patterns.jwt)
    assert.nestedPropertyVal(res.body.data, 'user.email', user.email)
    assert.nestedPropertyVal(res.body.data, 'user.role', user.role)
    assert.notNestedProperty(res.body.data, 'user.password')
  })

  test('returns 401 if credentials are invalid', async (assert) => {
    const user = await ctx.createUser()

    const res = await ctx.request
      .post('/login')
      .send({
        email: user.email,
        password: 'not the right password',
      })
      .expect(401)

    assert.deepStrictEqual(res.body, {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Wrong password',
    })
  })

  group.afterEach(after)
})

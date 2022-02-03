import test from 'ava'
import { after, before, ctx } from 'test/e2e/ctx'
import { patterns } from 'test/helpers/regex'

test.beforeEach(before)

test('logs in if credentials are valid', async (t) => {
  const user = await ctx.createUser()

  const res = await ctx.request
    .post('/login')
    .send({ email: user.email, password: 'password' })
    .expect(200)

  t.truthy(res.body.data.token)
  t.regex(res.body.data.token, patterns.jwt)
  t.is(res.body.data.user.email, user.email)
  t.is(res.body.data.user.role, user.role)
  t.is(res.body.data.user.password, undefined)
})

test('returns 401 if credentials are invalid', async (t) => {
  const user = await ctx.createUser()

  const res = await ctx.request
    .post('/login')
    .send({
      email: user.email,
      password: 'not the right password',
    })
    .expect(401)

  t.deepEqual(res.body, {
    statusCode: 401,
    error: 'Unauthorized',
    message: 'Wrong password',
  })
})

test.afterEach(after)

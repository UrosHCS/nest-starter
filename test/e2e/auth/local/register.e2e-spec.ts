import test from 'ava'
import { compare } from 'bcrypt'
import { Credential } from 'src/auth/credential.entity'
import { Role, User } from 'src/user/entities/user.entity'
import { after, before, ctx } from 'test/e2e/ctx'
import { patterns } from 'test/helpers/regex'

test.beforeEach(before)

test('creates and logs in the user if fields are valid', async (t) => {
  const email = 'some@example.com'
  const res = await ctx.request
    .post('/register')
    .send({
      email,
      password: 'somePassword',
    })
    .expect(201)

  t.truthy(res.body.data.token)
  t.regex(res.body.data.token, patterns.jwt)
  t.is(res.body.data.user.email, email)
  t.is(res.body.data.user.role, Role.client)
  t.falsy(res.body.data.user.password)
})

test('hashes user password correctly', async (t) => {
  const email = 'some@example.com'
  const password = 'somePassword'
  await ctx.request
    .post('/register')
    .send({
      email,
      password,
    })
    .expect(201)

  const user = await ctx.repo(User).findOneOrFail({ email })
  t.truthy(user.id)
  const userPassword = await ctx.repo(Credential).findOneOrFail({ userId: user.id })
  t.not(userPassword.value, password)

  const passwordsMatch = await compare('somePassword', userPassword.value)
  t.true(passwordsMatch)
})

test('trims email', async (t) => {
  const email = '  some@example.com  '
  const trimmedEmail = 'some@example.com'
  const res = await ctx.request
    .post('/register')
    .send({
      email,
      password: 'somePassword',
    })
    .expect(201)

  t.is(res.body.data.user.email, trimmedEmail)
})

test('does not trim password', async (t) => {
  const email = 'some@example.com'
  const password = '  somePassword  '
  const trimmedPassword = 'somePassword'
  const res = await ctx.request
    .post('/register')
    .send({
      email,
      password,
    })
    .expect(201)

  t.is(res.body.data.user.email, email)
  const user = await ctx.repo(User).findOneOrFail({ email })
  t.truthy(user)
  const userPassword = await ctx.repo(Credential).findOneOrFail({ userId: user.id })
  t.not(userPassword.value, password)
  t.false(await compare(trimmedPassword, userPassword.value))
  t.true(await compare(password, userPassword.value))
})

test('does not allow common passwords', async (t) => {
  const email = 'some@example.com'
  const password = '12345678'
  const res = await ctx.request
    .post('/register')
    .send({
      email,
      password,
    })
    .expect(400)

  t.deepEqual(res.body, {
    statusCode: 400,
    error: 'Bad Request',
    message: `Password ${password} can't be used because it is too common.`,
  })
})

test('does not allow email and password to be the same', async (t) => {
  const email = 'some@example.com'
  const res = await ctx.request
    .post('/register')
    .send({
      email,
      password: email,
    })
    .expect(400)

  t.deepEqual(res.body, {
    statusCode: 400,
    error: 'Bad Request',
    message: 'Password cannot be same as email.',
  })
})

test('fails if email already exists', async (t) => {
  const user = await ctx.createUser()

  const res = await ctx.request
    .post('/register')
    .send({
      email: user.email,
      password: 'somePassword',
    })
    .expect(400)

  t.deepEqual(res.body, {
    statusCode: 400,
    error: 'Bad Request',
    message: [
      {
        property: 'email',
        children: [],
        constraints: {
          doesNotExist: 'User with that email already exists.',
        },
      },
    ],
  })
})

test.afterEach(after)

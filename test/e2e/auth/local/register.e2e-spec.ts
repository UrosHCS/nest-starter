import { compare } from 'bcrypt'
import * as test from 'japa'
import { Credential } from 'src/auth/credential.entity'
import { Role, User } from 'src/user/entities/user.entity'
import { after, before, ctx } from 'test/e2e/ctx'
import { patterns } from 'test/helpers/regex'

test.group('Register', (group) => {
  group.beforeEach(before)

  test('creates and logs in the user if fields are valid', async (assert) => {
    const email = 'some@example.com'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password: 'somePassword',
      })
      .expect(201)

    assert.property(res.body.data, 'token')
    assert.match(res.body.data.token, patterns.jwt)
    assert.nestedPropertyVal(res.body.data, 'user.email', email)
    assert.nestedPropertyVal(res.body.data, 'user.role', Role.client)
    assert.notNestedProperty(res.body.data, 'user.password')
  })

  test('hashes user password correctly', async (assert) => {
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
    assert.isAtLeast(user.id, 1)
    const userPassword = await ctx.repo(Credential).findOneOrFail({ userId: user.id })
    assert.notEqual(userPassword.value, password)

    const passwordsMatch = await compare('somePassword', userPassword.value)
    assert.isTrue(passwordsMatch)
  })

  test('trims email', async (assert) => {
    const email = '  some@example.com  '
    const trimmedEmail = 'some@example.com'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password: 'somePassword',
      })
      .expect(201)

    console.log(res.body)
    assert.nestedPropertyVal(res.body.data, 'user.email', trimmedEmail)
  })

  test('does not trim password', async (assert) => {
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

    assert.nestedPropertyVal(res.body.data, 'user.email', email)
    const user = await ctx.repo(User).findOneOrFail({ email })
    assert.isObject(user)
    const userPassword = await ctx.repo(Credential).findOneOrFail({ userId: user.id })
    assert.notEqual(userPassword.value, password)
    assert.isFalse(await compare(trimmedPassword, userPassword.value))
    assert.isTrue(await compare(password, userPassword.value))
  })

  test('does not allow common passwords', async (assert) => {
    const email = 'some@example.com'
    const password = '12345678'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password,
      })
      .expect(400)

    assert.deepStrictEqual(res.body, {
      statusCode: 400,
      error: 'Bad Request',
      message: `Password ${password} can't be used because it is too common.`,
    })
  })

  test('does not allow email and password to be the same', async (assert) => {
    const email = 'some@example.com'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password: email,
      })
      .expect(400)

    assert.deepStrictEqual(res.body, {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Password cannot be same as email.',
    })
  })

  test('fails if email already exists', async (assert) => {
    const user = await ctx.createUser()

    const res = await ctx.request
      .post('/register')
      .send({
        email: user.email,
        password: 'somePassword',
      })
      .expect(400)

    assert.deepStrictEqual(res.body, {
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

  group.afterEach(after)
})

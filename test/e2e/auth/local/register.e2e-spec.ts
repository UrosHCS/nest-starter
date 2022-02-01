import { compare } from 'bcrypt'
import { Credential } from 'src/auth/credential.entity'
import { Role, User } from 'src/user/entities/user.entity'
import { after, before, ctx } from 'test/e2e/ctx'
import { patterns } from 'test/helpers/regex'

describe('Register', () => {
  beforeEach(before)

  it('creates and logs in the user if fields are valid', async () => {
    const email = 'some@example.com'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password: 'somePassword',
      })
      .expect(201)

    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data.token).toMatch(patterns.jwt)
    expect(res.body.data).toHaveProperty('user.email', email)
    expect(res.body.data).toHaveProperty('user.role', Role.client)
    expect(res.body.data).not.toHaveProperty('user.password')
  })

  it('hashes user password correctly', async () => {
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
    expect(user.id).toBeTruthy()
    const userPassword = await ctx.repo(Credential).findOneOrFail({ userId: user.id })
    expect(userPassword.value).not.toEqual(password)

    const passwordsMatch = await compare('somePassword', userPassword.value)
    expect(passwordsMatch).toStrictEqual(true)
  })

  it('trims email', async () => {
    const email = '  some@example.com  '
    const trimmedEmail = 'some@example.com'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password: 'somePassword',
      })
      .expect(201)

    expect(res.body.data).toHaveProperty('user.email', trimmedEmail)
  })

  it('does not trim password', async () => {
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

    expect(res.body.data).toHaveProperty('user.email', email)
    const user = await ctx.repo(User).findOneOrFail({ email })
    expect(user).toBeTruthy()
    const userPassword = await ctx.repo(Credential).findOneOrFail({ userId: user.id })
    expect(userPassword.value).not.toEqual(password)
    expect(await compare(trimmedPassword, userPassword.value)).toStrictEqual(false)
    expect(await compare(password, userPassword.value)).toStrictEqual(true)
  })

  it('does not allow common passwords', async () => {
    const email = 'some@example.com'
    const password = '12345678'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password,
      })
      .expect(400)

    expect(res.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: `Password ${password} can't be used because it is too common.`,
    })
  })

  it('does not allow email and password to be the same', async () => {
    const email = 'some@example.com'
    const res = await ctx.request
      .post('/register')
      .send({
        email,
        password: email,
      })
      .expect(400)

    expect(res.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Password cannot be same as email.',
    })
  })

  it('fails if email already exists', async () => {
    const user = await ctx.createUser()

    const res = await ctx.request
      .post('/register')
      .send({
        email: user.email,
        password: 'somePassword',
      })
      .expect(400)

    expect(res.body).toEqual({
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

  afterEach(after)
})

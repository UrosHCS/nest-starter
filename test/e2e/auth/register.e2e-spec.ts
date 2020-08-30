import { compare } from 'bcrypt'
import { expect } from 'chai'
import { Role, User } from 'src/database/entities/user.entity'
import { ctx, setUp, tearDown } from '../ctx'

describe('Register', () => {
  beforeEach(setUp)

  it('creates and logs in the user if fields are valid', async () => {
    const email = 'some@example.com'
    return ctx.request
      .post('/register')
      .send({
        email,
        password: 'somePassword',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.data).to.have.property('token')
        expect(res.body.data.token).to.match(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        expect(res.body.data).to.have.nested.property('user.email', email)
        expect(res.body.data).to.have.nested.property('user.role', Role.client)
        expect(res.body.data).not.to.have.nested.property('user.password')
      })
  })

  it('hashes user password correctly', async () => {
    const email = 'some@example.com'
    const password = 'somePassword'
    return ctx.request
      .post('/register')
      .send({
        email,
        password,
      })
      .expect(201)
      .then(async () => {
        const user = await ctx.repo(User).findOne({ email })
        expect(user).to.be.an('object')
        expect((user as User).password).not.to.equal(password)

        const passwordsMatch = await compare('somePassword', (user as User).password)
        expect(passwordsMatch).to.be.true
      })
  })

  it('trims email', async () => {
    const email = '  some@example.com  '
    const trimmedEmail = 'some@example.com'
    return ctx.request
      .post('/register')
      .send({
        email,
        password: 'somePassword',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.data).to.have.nested.property('user.email', trimmedEmail)
      })
  })

  it('does not trim password', async () => {
    const email = 'some@example.com'
    const password = '  somePassword  '
    const trimmedPassword = 'somePassword'
    return ctx.request
      .post('/register')
      .send({
        email,
        password,
      })
      .expect(201)
      .then(async () => {
        const user = await ctx.repo(User).findOne({ email })
        expect(user).to.be.an('object')

        expect(await compare(trimmedPassword, (user as User).password)).to.be.false
        expect(await compare(password, (user as User).password)).to.be.true
      })
  })

  it('does not allow common passwords', async () => {
    const email = 'some@example.com'
    const password = '12345678'
    return ctx.request
      .post('/register')
      .send({
        email,
        password,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.deep.equal({
          statusCode: 400,
          error: 'Bad Request',
          message: `Password ${password} can't be used because it is too common.`,
        })
      })
  })

  it('does not allow email and password to be the same', async () => {
    const email = 'some@example.com'
    return ctx.request
      .post('/register')
      .send({
        email,
        password: email,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.deep.equal({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Password cannot be same as email.',
        })
      })
  })

  it('fails if email already exists', async () => {
    const user = await ctx.createUser()

    return ctx.request
      .post('/register')
      .send({
        email: user.email,
        password: 'somePassword',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.deep.equal({
          statusCode: 400,
          error: 'Bad Request',
          message: [
            {
              property: 'email',
              children: [],
              constraints: {
                exists: 'User with that email already exists.',
              },
            },
          ],
        })
      })
  })

  afterEach(tearDown)
})

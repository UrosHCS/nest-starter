import { expect } from 'chai'
import { ctx, setUp, tearDown } from '../ctx'

describe('LogIn', () => {
  beforeEach(setUp)

  it('logs in if credentials are valid', async () => {
    const user = await ctx.createUser()

    return ctx.request
      .post('/login')
      .send({ email: user.email, password: 'password' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).to.have.property('token')
        expect(res.body.data.token).to.match(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        expect(res.body.data).to.have.nested.property('user.email', user.email)
        expect(res.body.data).to.have.nested.property('user.role', user.role)
        expect(res.body.data).not.to.have.nested.property('user.password')
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
        expect(res.body).to.deep.equal({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Wrong password',
        })
      })
  })

  afterEach(tearDown)
})

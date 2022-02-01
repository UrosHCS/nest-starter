import { User } from 'src/user/entities/user.entity'
import { UserFactory } from 'src/user/factories/user.factory'
import { after, before, ctx } from '../ctx'

describe('users get', () => {
  let user: User

  // Since this whole test is just GET requests there is no persistance, no mutations.
  // So we make the tests run faster by using beforeAll instead of beforeEach. Same
  // for afterAll. This could be less safe then beforeEach, I'm not sure.
  beforeAll(async () => {
    await before()
    user = await new UserFactory().create()
  })

  it('returns the user if it exists', async () => {
    const res = await ctx.request.get('/users/' + user.id).expect(200)
    expect(res.body.data.id).toEqual(user.id)
    expect(res.body.data.email).toEqual(user.email)
  })

  it('fails if the user does not exist', async () => {
    const res = await ctx.request.get('/users/' + user.id + 1).expect(404)
    expect(res.body.error).toEqual('Not Found')
  })

  afterAll(after)
})

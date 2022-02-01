import { User } from 'src/user/entities/user.entity'
import { UserFactory } from 'src/user/factories/user.factory'
import { after, before, ctx } from '../ctx'

describe('users index', () => {
  let users: User[]

  // Since this whole test is just GET requests there is no persistance, no mutations.
  // So we make the tests run faster by using beforeAll instead of beforeEach. Same
  // for afterAll. This could be less safe then beforeEach, I'm not sure.
  beforeAll(async () => {
    await before()
    users = await new UserFactory().createMany(3)
  })

  it('returns all users if limit is big enough', async () => {
    const res = await ctx.request.get('/users').query({ page: 1, limit: 3 }).expect(200)
    expect(res.body.data.length).toEqual(users.length)
  })

  it('works on page 2', async () => {
    const res = await ctx.request.get('/users').query({ page: 2, limit: 2 }).expect(200)
    expect(res.body.data.length).toEqual(1)
  })

  it('returns page 1 if page is not specified', async () => {
    const res = await ctx.request.get('/users').query({ limit: 3 }).expect(200)
    expect(res.body.data.length).toEqual(users.length)
    expect(res.body.pagination.page).toEqual(1)
  })

  it('returns limit 10 if limit is not specified', async () => {
    const res = await ctx.request.get('/users').query({ page: 1 }).expect(200)
    expect(res.body.data.length).toEqual(users.length)
    expect(res.body).toHaveProperty('pagination.limit')
    expect(res.body.pagination.limit).toEqual(10)
  })

  it('returns 400 if page is less than one', async () => {
    const res = await ctx.request.get('/users').query({ page: 0, limit: 1 }).expect(400)
    expect(res.body).toHaveProperty('message.0.constraints.min')
    expect(res.body.message[0].constraints.min).toEqual('page must not be less than 1')
  })

  it('returns 400 if limit is less than one', async () => {
    const res = await ctx.request.get('/users').query({ limit: 0, page: 1 }).expect(400)
    expect(res.body).toHaveProperty('message.0.constraints.min')
    expect(res.body.message[0].constraints.min).toEqual('limit must not be less than 1')
  })

  it('returns 400 if page not an int', async () => {
    const res = await ctx.request.get('/users').query({ page: 1.1, limit: 1 }).expect(400)
    expect(res.body).toHaveProperty('message.0.constraints.isInt')
    expect(res.body.message[0].constraints.isInt).toEqual('page must be an integer number')
  })

  it('returns 400 if limit not an int', async () => {
    const res = await ctx.request.get('/users').query({ limit: 1.1, page: 1 }).expect(400)
    expect(res.body).toHaveProperty('message.0.constraints.isInt')
    expect(res.body.message[0].constraints.isInt).toEqual('limit must be an integer number')
  })

  it('returns 400 if direction is not valid', async () => {
    const res = await ctx.request
      .get('/users')
      .query({ limit: 1, page: 1, direction: 'invalid direction' })
      .expect(400)
    expect(res.body).toHaveProperty('message.0.constraints.isIn')
    expect(res.body.message[0].constraints.isIn).toEqual(
      'direction must be one of the following values: asc, desc',
    )
  })

  afterAll(after)
})

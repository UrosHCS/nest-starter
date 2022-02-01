import * as test from 'japa'
import { User } from 'src/user/entities/user.entity'
import { UserFactory } from 'src/user/factories/user.factory'
import { after, before, ctx } from '../ctx'

test.group('users index', (group) => {
  let users: User[]

  // Since this whole test is just GET requests there is no persistance, no mutations.
  // So we make the tests run faster by using beforeAll instead of beforeEach. Same
  // for afterAll. This could be less safe then beforeEach, I'm not sure.
  group.before(async () => {
    await before()
    users = await new UserFactory().createMany(3)
  })

  test('returns all users if limit is big enough', async (assert) => {
    const res = await ctx.request.get('/users').query({ page: 1, limit: 3 }).expect(200)
    assert.equal(res.body.data.length, users.length)
  })

  test('works on page 2', async (assert) => {
    const res = await ctx.request.get('/users').query({ page: 2, limit: 2 }).expect(200)
    assert.equal(res.body.data.length, 1)
  })

  test('returns page 1 if page is not specified', async (assert) => {
    const res = await ctx.request.get('/users').query({ limit: 3 }).expect(200)
    assert.equal(res.body.data.length, users.length)
    assert.equal(res.body.pagination.page, 1)
  })

  test('returns limit 10 if limit is not specified', async (assert) => {
    const res = await ctx.request.get('/users').query({ page: 1 }).expect(200)
    assert.equal(res.body.data.length, users.length)
    assert.nestedProperty(res.body, 'pagination.limit')
    assert.equal(res.body.pagination.limit, 10)
  })

  test('returns 400 if page is less than one', async (assert) => {
    const res = await ctx.request.get('/users').query({ page: 0, limit: 1 }).expect(400)
    assert.nestedProperty(res.body, 'message.0.constraints.min')
    assert.equal(res.body.message[0].constraints.min, 'page must not be less than 1')
  })

  test('returns 400 if limit is less than one', async (assert) => {
    const res = await ctx.request.get('/users').query({ limit: 0, page: 1 }).expect(400)
    assert.nestedProperty(res.body, 'message.0.constraints.min')
    assert.equal(res.body.message[0].constraints.min, 'limit must not be less than 1')
  })

  test('returns 400 if page not an int', async (assert) => {
    const res = await ctx.request.get('/users').query({ page: 1.1, limit: 1 }).expect(400)
    assert.nestedProperty(res.body, 'message.0.constraints.isInt')
    assert.equal(res.body.message[0].constraints.isInt, 'page must be an integer number')
  })

  test('returns 400 if limit not an int', async (assert) => {
    const res = await ctx.request.get('/users').query({ limit: 1.1, page: 1 }).expect(400)
    assert.nestedProperty(res.body, 'message.0.constraints.isInt')
    assert.equal(res.body.message[0].constraints.isInt, 'limit must be an integer number')
  })

  test('returns 400 if direction is not valid', async (assert) => {
    const res = await ctx.request
      .get('/users')
      .query({ limit: 1, page: 1, direction: 'invalid direction' })
      .expect(400)
    assert.nestedProperty(res.body, 'message.0.constraints.isIn')
    assert.equal(
      res.body.message[0].constraints.isIn,
      'direction must be one of the following values: asc, desc',
    )
  })

  group.after(after)
})

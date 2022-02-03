import test from 'ava'
import { User } from 'src/user/entities/user.entity'
import { UserFactory } from 'src/user/factories/user.factory'
import { after, before, ctx } from '../ctx'

let users: User[]

// Since this whole test is just GET requests there is no persistance, no mutations.
// So we make the tests run faster by using beforeAll instead of beforeEach. Same
// for afterAll. This could be less safe then beforeEach, I'm not sure.
test.before(async () => {
  await before()
  users = await new UserFactory().createMany(3)
})

test('returns all users if limit is big enough', async (t) => {
  const res = await ctx.request.get('/users').query({ page: 1, limit: 3 }).expect(200)
  t.is(res.body.data.length, users.length)
})

test('works on page 2', async (t) => {
  const res = await ctx.request.get('/users').query({ page: 2, limit: 2 }).expect(200)
  t.is(res.body.data.length, 1)
})

test('returns page 1 if page is not specified', async (t) => {
  const res = await ctx.request.get('/users').query({ limit: 3 }).expect(200)
  t.is(res.body.data.length, users.length)
  t.is(res.body.pagination.page, 1)
})

test('returns limit 10 if limit is not specified', async (t) => {
  const res = await ctx.request.get('/users').query({ page: 1 }).expect(200)
  t.is(res.body.data.length, users.length)
  t.is(res.body.pagination.limit, 10)
})

test('returns 400 if page is less than one', async (t) => {
  const res = await ctx.request.get('/users').query({ page: 0, limit: 1 }).expect(400)
  t.is(res.body.message[0].constraints.min, 'page must not be less than 1')
})

test('returns 400 if limit is less than one', async (t) => {
  const res = await ctx.request.get('/users').query({ limit: 0, page: 1 }).expect(400)
  t.is(res.body.message[0].constraints.min, 'limit must not be less than 1')
})

test('returns 400 if page not an int', async (t) => {
  const res = await ctx.request.get('/users').query({ page: 1.1, limit: 1 }).expect(400)
  t.is(res.body.message[0].constraints.isInt, 'page must be an integer number')
})

test('returns 400 if limit not an int', async (t) => {
  const res = await ctx.request.get('/users').query({ limit: 1.1, page: 1 }).expect(400)
  t.is(res.body.message[0].constraints.isInt, 'limit must be an integer number')
})

test('returns 400 if direction is not valid', async (t) => {
  const res = await ctx.request
    .get('/users')
    .query({ limit: 1, page: 1, direction: 'invalid direction' })
    .expect(400)
  t.is(
    res.body.message[0].constraints.isIn,
    'direction must be one of the following values: asc, desc',
  )
})

test.after(after)

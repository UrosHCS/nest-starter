import { expect } from 'chai'
import { User } from 'src/database/entities/user.entity'
import { ctx, setUp, tearDown } from '../ctx'

describe('users index', () => {
  let users: User[]

  // Since this whole test is just GET requests there is no persistance, no mutations.
  // So we make the tests run faster by using before instead of beforeEach. Same
  // for after. This could be less safe then beforeEach, I'm not sure.
  before(async () => {
    await setUp()
    users = await ctx.factory(User).createMany(3)
  })

  it('returns all users if limit is big enough', async () => {
    return ctx.request
      .get('/users')
      .query({ page: 1, limit: 3 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).to.equal(users.length)
      })
  })

  it('works on page 2', async () => {
    return ctx.request
      .get('/users')
      .query({ page: 2, limit: 2 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).to.equal(1)
      })
  })

  it('returns page 1 if page is not specified', async () => {
    return ctx.request
      .get('/users')
      .query({ limit: 3 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).to.equal(users.length)
        expect(res.body.pagination.page).to.equal(1)
      })
  })

  it('returns limit 10 if limit is not specified', async () => {
    return ctx.request
      .get('/users')
      .query({ page: 1 })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.length).to.equal(users.length)
        expect(res.body).to.have.nested.property('pagination.limit')
        expect(res.body.pagination.limit).to.equal(10)
      })
  })

  it('returns 400 if page is less than one', async () => {
    return ctx.request
      .get('/users')
      .query({ page: 0, limit: 1 })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.have.nested.property('message[0].constraints.min')
        expect(res.body.message[0].constraints.min).to.equal('page must not be less than 1')
      })
  })

  it('returns 400 if limit is less than one', async () => {
    return ctx.request
      .get('/users')
      .query({ limit: 0, page: 1 })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.have.nested.property('message[0].constraints.min')
        expect(res.body.message[0].constraints.min).to.equal('limit must not be less than 1')
      })
  })

  it('returns 400 if page not an int', async () => {
    return ctx.request
      .get('/users')
      .query({ page: 1.1, limit: 1 })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.have.nested.property('message[0].constraints.isInt')
        expect(res.body.message[0].constraints.isInt).to.equal('page must be an integer number')
      })
  })

  it('returns 400 if limit not an int', async () => {
    return ctx.request
      .get('/users')
      .query({ limit: 1.1, page: 1 })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.have.nested.property('message[0].constraints.isInt')
        expect(res.body.message[0].constraints.isInt).to.equal('limit must be an integer number')
      })
  })

  it('returns 400 if direction is not valid', async () => {
    return ctx.request
      .get('/users')
      .query({ limit: 1, page: 1, direction: 'invalid direction' })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.have.nested.property('message[0].constraints.isInCaseInsensitive')
        expect(res.body.message[0].constraints.isInCaseInsensitive).to.equal(
          `The property "direction" must be one of: asc, desc, ASC, DESC. Value "invalid direction" given.`,
        )
      })
  })

  after(tearDown)
})

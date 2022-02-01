import * as test from 'japa'
import { User } from 'src/user/entities/user.entity'
import { UserFactory } from 'src/user/factories/user.factory'
import { after, before, ctx } from '../ctx'

test.group('users get', (group) => {
  let user: User

  // Since this whole test is just GET requests there is no persistance, no mutations.
  // So we make the tests run faster by using beforeAll instead of beforeEach. Same
  // for afterAll. This could be less safe then beforeEach, I'm not sure.
  group.before(async () => {
    await before()
    user = await new UserFactory().create()
  })

  test('returns the user if it exists', async (assert) => {
    const res = await ctx.request.get('/users/' + user.id).expect(200)
    assert.equal(res.body.data.id, user.id)
    assert.equal(res.body.data.email, user.email)
  })

  test('fails if the user does not exist', async (assert) => {
    const res = await ctx.request.get('/users/' + user.id + 1).expect(404)
    assert.equal(res.body.error, 'Not Found')
  })

  group.after(after)
})

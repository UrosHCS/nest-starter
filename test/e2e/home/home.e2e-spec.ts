// This is a test for home page but it is actually a blueprint for new tests.
import * as test from 'japa'
import { after, before, ctx } from '../ctx'

test.group('a test', (group) => {
  group.beforeEach(before)

  test('tests something', async () => {
    await ctx.request.get('/').expect(200)
  })

  group.afterEach(after)
})

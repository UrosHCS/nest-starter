// This is a test for home page but it is actually a blueprint for new tests.
import test from 'ava'
import { after, before, ctx } from '../ctx'

test.beforeEach(before)

test('tests something', async () => {
  await ctx.request.get('/').expect(200)
})

test.afterEach(after)

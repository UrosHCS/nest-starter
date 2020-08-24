// This is a test for home page but it is actually a blueprint for new tests.
import { after, before, ctx } from '../ctx'

describe('a test', () => {
  beforeEach(before)

  it('tests something', async () => {
    return ctx.request.get('/').expect(200)
  })

  afterEach(after)
})

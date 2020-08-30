// This is a test for home page but it is actually a blueprint for new tests.
import { ctx, setUp, tearDown } from '../ctx'

describe('a test', () => {
  beforeEach(setUp)

  it('tests something', async () => {
    return ctx.request.get('/').expect(200)
  })

  afterEach(tearDown)
})

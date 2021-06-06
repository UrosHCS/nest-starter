import { Credential } from 'src/auth/credential.entity'
import { OauthUser } from 'src/auth/interfaces/oauth.user'
import { Role, User } from 'src/user/entities/user.entity'
import { after, before, ctx } from 'test/e2e/ctx'
import { patterns } from 'test/helpers/regex'

const oauthUser = googleStrategyProfile()

describe('Register', () => {
  beforeEach(before)

  it('creates and logs in the user if google credentials are valid', async () => {
    return ctx.request
      .get('/google/register')
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('token')
        expect(res.body.data.token).toMatch(patterns.jwt)
        expect(res.body.data).toHaveProperty('user.email', oauthUser.email)
        expect(res.body.data).toHaveProperty('user.role', Role.client)
        expect(res.body.data).not.toHaveProperty('user.password')
      })
  })

  it('saves google credentials', async () => {
    return ctx.request
      .get('/google/register')
      .expect(201)
      .then(async () => {
        const user = await ctx.repo(User).findOneOrFail({ email: oauthUser.email })
        expect(user.id).toBeTruthy()
        expect(user.name).toEqual(oauthUser.name)
        const credential = await ctx.repo(Credential).findOneOrFail({ userId: user.id })
        expect(credential.value).toEqual(oauthUser.id)
        // TODO: test photo when implemented
      })
  })

  afterEach(after)
})

function googleStrategyProfile(): OauthUser {
  return {
    id: 'some id',
    name: 'John Smith',
    email: 'john.smith@example.com',
    photo: 'http://non-existing.image/name.jpg',
  }
}

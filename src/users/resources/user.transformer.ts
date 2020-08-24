import { safeUserFields } from 'src/database/entities/user.entity'
import { Transformer } from 'src/shared/response/transformer'

export class UserTransformer extends Transformer {
  transform() {
    const response = {}

    // TODO: make and use a PostTransformer
    safeUserFields.push('posts')

    for (const field of safeUserFields) {
      response[field] = this.resource[field]
    }

    return response
  }
}

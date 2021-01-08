import { safeUserFields } from "../../database/entities/user.entity.js"
import { Transformer } from "../../shared/response/transformer.js"

export class UserTransformer extends Transformer {
  transform() {
    const response = {}

    for (const field of safeUserFields) {
      response[field] = this.resource[field]
    }

    return response
  }
}

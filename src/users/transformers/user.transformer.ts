import { safeUserFields } from "src/database/entities/user.entity"
import { Transformer } from "src/shared/response/transformer"

export class UserTransformer extends Transformer {
  transform() {
    const response = {}

    for (const field of safeUserFields) {
      response[field] = this.resource[field]
    }

    return response
  }
}

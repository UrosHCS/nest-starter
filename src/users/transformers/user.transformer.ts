import { Transformer } from 'src/shared/response/transformer'

export class UserTransformer extends Transformer {
  transform() {
    return this.resource
  }
}

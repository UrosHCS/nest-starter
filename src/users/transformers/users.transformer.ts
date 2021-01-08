import { Transformer } from '../../shared/response/transformer.js'
import { UserTransformer } from './user.transformer.js'

export class UsersTransformer extends Transformer {
  protected collectFrom() {
    return UserTransformer
  }
}

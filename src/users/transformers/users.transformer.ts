import { Transformer } from 'src/shared/response/transformer'
import { UserTransformer } from './user.transformer'

export class UsersTransformer extends Transformer {
  protected collectFrom() {
    return UserTransformer
  }
}

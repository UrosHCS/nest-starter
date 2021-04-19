import { Column } from './column'
import { FieldRelation } from './seed'

export interface ResolverFunction<E> {
  (name: string, relation?: FieldRelation<E>): string | Promise<string>
}

export class Resolver<E> extends Column {
  constructor(
    name: string,
    private resolver: ResolverFunction<E>,
    private relation?: FieldRelation<E>,
  ) {
    super(name)
  }

  async getPlaceholder(): Promise<string> {
    return await this.resolver(this.name, this.relation)
  }
}

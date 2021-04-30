import { Column, ColumnOptions } from './column'
import { FieldRelation } from './relation'

export interface ResolverFunction<E> {
  (name: string, relation?: FieldRelation<E>): string | Promise<string>
}

export interface ResolverOptions<E> extends ColumnOptions {
  /**
   * Function which creates a custom resolver for the field
   */
  resolver: ResolverFunction<E>
  relation?: FieldRelation<E>
}

export class Resolver<E> extends Column {
  constructor(name: string, protected options: ResolverOptions<E>) {
    super(name)
  }

  getPlaceholder(): string | Promise<string> {
    return this.options.resolver(this.getName(), this.options.relation)
  }
}

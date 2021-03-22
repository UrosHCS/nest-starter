import { Column } from './column'
import { FieldRelation, NoArgConstructor } from './seed'

export class Resolver<E> extends Column {
  constructor(name: string, private resolver: Function, private relation?: FieldRelation<E>) {
    super(name)
  }

  private getResolver(): Function {
    return this.resolver
  }

  private getEntity(): NoArgConstructor<E> | undefined {
    return this.relation && this.relation[0]
  }

  private getField(): keyof E | undefined {
    return this.relation && this.relation[1]
  }
}

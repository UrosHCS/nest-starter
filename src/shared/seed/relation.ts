import { Column } from './column'
import { FieldRelation, NoArgConstructor } from './seed'

export class Relation<E> extends Column {
  constructor(name: string, private relation: FieldRelation<E>) {
    super(name)
  }

  private getEntity(): NoArgConstructor<E> {
    return this.relation.entityClass
  }

  private getDisplayField(): keyof E {
    return this.relation.displayField
  }

  private getValueField(): keyof E {
    return this.relation.valueField
  }
}

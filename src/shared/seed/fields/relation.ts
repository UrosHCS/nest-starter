import { getConnection } from 'typeorm'
import { FieldRelation, NoArgConstructor } from '../seed'
import { Column } from './column'

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

  getPlaceholder(): string {
    const table = getConnection().getMetadata(this.getEntity()).tableName

    return `(SELECT ${this.getValueField()} FROM ${table} WHERE ${this.getDisplayField()} = ?)`
  }
}

import { NoArgConstructor } from 'src/shared/common/no.arg.constructor'
import { getConnection } from 'typeorm'
import { Column, ColumnOptions } from './column'

export interface RelationOptions<E> extends ColumnOptions {
  /**
   * Another entity from which to resolve the field
   */
  relation: FieldRelation<E>
}

export type FieldRelation<E> = {
  entityClass: NoArgConstructor<E>
  displayField: keyof E
  valueField: keyof E
}

export class Relation<E> extends Column {
  constructor(name: string, protected options: RelationOptions<E>) {
    super(name)
  }

  private getEntity(): NoArgConstructor<E> {
    return this.options.relation.entityClass
  }

  private getDisplayField(): keyof E {
    return this.options.relation.displayField
  }

  private getValueField(): keyof E {
    return this.options.relation.valueField
  }

  getPlaceholder(): string {
    const table = getConnection().getMetadata(this.getEntity()).tableName

    return `(SELECT ${this.getValueField()} FROM ${table} WHERE ${this.getDisplayField()} = ?)`
  }
}

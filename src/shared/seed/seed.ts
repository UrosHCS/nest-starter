import { NoArgConstructor } from 'src/shared/common/no.arg.constructor'
import { Column, ColumnOptions } from './fields/column'
import { Relation, RelationOptions } from './fields/relation'
import { Resolver, ResolverOptions } from './fields/resolver'
import { Query } from './processors/query'
import { Reader } from './reader'

export interface Columns {
  [key: string]: Column
}

export abstract class Seed<E> {
  protected abstract entityClass: NoArgConstructor<E>

  protected abstract filePath: string

  protected bufferLength: number = 1000

  async run(): Promise<void> {
    const columns = this.columns()

    const fields = Object.keys(columns)

    const processor = new Query(this.entityClass, columns)

    await new Reader({ fields, processor, bufferLength: this.bufferLength }).read(this.filePath)
  }

  abstract definition(): Column[]

  private columns(): Columns {
    let columns: Columns = {}

    for (const column of this.definition()) {
      columns[column.getName()] = column
    }

    return columns
  }

  column(name: string, options?: ColumnOptions): Column {
    return new Column(name, options)
  }

  relation<R>(name: string, options: RelationOptions<R>): Relation<R> {
    return new Relation(name, options)
  }

  resolver<R>(name: string, options: ResolverOptions<R>): Resolver<R> {
    return new Resolver<R>(name, options)
  }
}

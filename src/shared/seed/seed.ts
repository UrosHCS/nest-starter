import { Column } from './column'
import { Query } from './query'
import { Reader } from './reader'
import { Relation } from './relation'
import { Resolver, ResolverFunction } from './resolver'

export interface NoArgConstructor<Class> {
  new (): Class
}

/**
 * Example [User, 'email']
 */
export type FieldRelation<E> = {
  entityClass: NoArgConstructor<E>
  displayField: keyof E
  valueField: keyof E
}

export interface FieldOptions<E> {
  /**
   * Name of the field in the database (use if csv and database columns are different)
   */
  databaseField?: string
  /**
   * Another entity from which to resolve the field
   */
  relation?: FieldRelation<E>
  /**
   * Function which creates a custom resolver for the field
   */
  resolver?: ResolverFunction<E>
}

export abstract class Seed<E> {
  protected abstract entityClass: NoArgConstructor<E>

  protected abstract filePath: string

  abstract definition(): object

  /**
   * @param {string} name Name of the column in the csv file
   * @param {FieldOptions} options Definition for non-trivial fields
   */
  protected field<R>(name: string, options?: FieldOptions<R>): Column {
    if (options?.resolver) {
      return this.resolver(name, options.resolver, options.relation)
    }

    if (options?.relation) {
      return this.relation(name, options.relation)
    }

    return this.column(name)
  }

  protected column(name: string): Column {
    return new Column(name)
  }

  protected relation<R>(name: string, relation: FieldRelation<R>): Relation<R> {
    return new Relation(name, relation)
  }

  protected resolver<R>(
    name: string,
    resolver: ResolverFunction<R>,
    relation?: FieldRelation<R>,
  ): Resolver<R> {
    return new Resolver<R>(name, resolver, relation)
  }

  async run(): Promise<void> {
    const columns = this.definition()

    await new Reader(this.filePath, columns, new Query(this.entityClass, columns)).read()
  }
}

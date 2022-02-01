import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { Paginator } from './paginator'

export interface PaginateOptions<E> extends FindOneOptions<E> {
  page?: number
  limit?: number
}

type DestructuredOptions<E> = { page?: number; limit?: number } & FindManyOptions<E>

export abstract class BaseRepository<E> extends Repository<E> {
  protected DEFAULT_PAGE = 1
  protected DEFAULT_LIMIT = 10

  // Here we can add methods that will be usable in every repository.
  // Just make sure that every new repository extends this class.

  /**
   * PaginateOptions extend FindManyOptions because it is simpler to work
   * with that type in this method. But in reality it should extend
   * FindOneOptions because "take" and "skip" are gonna be overridden.
   */
  async paginate(paginationOptions: PaginateOptions<E>): Promise<Paginator<E>> {
    let {
      page = this.DEFAULT_PAGE,
      limit = this.DEFAULT_LIMIT,
      ...options
    }: DestructuredOptions<E> = paginationOptions

    options.take = limit
    options.skip = (page - 1) * limit

    const [entities, total] = await this.findAndCount(options)

    return new Paginator(entities, page, limit, total)
  }

  /**
   * Same as save but returned object is an instance of the entity,
   * not a plain object.
   */
  createAndSave(attributes: DeepPartial<E>): Promise<E> {
    return this.save(this.create(attributes))
  }
}

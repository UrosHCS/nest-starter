import { FindManyOptions, Repository } from 'typeorm';
import { Paginator } from './paginator';

export interface PaginateOptions<E> extends FindManyOptions<E> {
  page?: number
  limit?: number
}

export abstract class BaseRepository<E> extends Repository<E> {
  // Here we can add methods that will be usable in every repository.
  // Just make sure that every new repository extends this class.

  /**
   * PaginateOptions extend FindManyOptions because it is simpler to work
   * with that type in this method. But in reality it should extend
   * FindOneOptions because "take" and "skip" are gonna be overridden.
   */
  async paginate(paginationOptions: PaginateOptions<E>): Promise<Paginator<E>> {
    let { page, limit, ...options } = paginationOptions

    page = page || 1
    limit = limit || 10
    options.take = limit
    options.skip = (page - 1) * limit

    const [entities, total] = await this.findAndCount(options)

    return new Paginator(entities, page, limit, total)
  }
}

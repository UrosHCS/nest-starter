export interface PaginationMeta {
  total: number
  count: number
  hasMorePages: boolean
  page: number
  limit: number
}

export class Paginator<E> {
  data: E[]
  pagination: PaginationMeta

  constructor(data: E[], page: number, limit: number, total: number) {
    this.data = data

    this.pagination = {
      page,
      limit,
      count: data.length,
      total,
      hasMorePages: total > page * limit,
    }
  }
}

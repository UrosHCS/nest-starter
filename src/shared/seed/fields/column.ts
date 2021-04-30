export interface ColumnOptions {
  /**
   * Name of the field in the database (use if csv and database columns are different)
   */
  databaseField?: string
}

export class Column {
  constructor(protected name: string, protected options?: ColumnOptions) {}

  getName(): string {
    return this.name
  }

  getDatabaseFieldName(): string {
    return this.options?.databaseField || this.getName()
  }

  getPlaceholder(): string | Promise<string> {
    return '?'
  }
}

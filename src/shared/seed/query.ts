import { getConnection, getManager } from 'typeorm'

export class Query {
  constructor(private entityClass: Function, private columns: object) {}

  handle(rows: object[]) {
    const columns = this.columns
    const manager = getManager()
    const connection = getConnection()

    const table = connection.getMetadata(this.entityClass).tableName

    const columnNames = Object.keys(columns)

    const placeholderRows: string[] = []

    const parameters: Array<string | number | boolean | null> = []

    for (const row of rows) {
      const placeholderColumns: any[] = []
      for (const field in row) {
        const column = columns[field]
        placeholderColumns.push(column.getPlaceholder())

        // TODO: If no ? then no need to push value
        parameters.push(row[field])
      }

      placeholderRows.push(placeholderColumns.join(', '))
    }

    const values = placeholderRows.join(', ')

    const sql = `INSERT INTO ${table} (${columnNames}) VALUES ${values}`

    // const result = manager.query(sql, parameters)

    console.log(sql, parameters)
  }
}

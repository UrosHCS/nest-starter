import { getConnection } from 'typeorm'
import { Columns } from '../seed'

export class Query {
  constructor(private entityClass: Function, private columns: Columns) {}

  async handle(rows: object[]) {
    const columns = this.columns
    const connection = getConnection()
    const manager = connection.manager

    const table = connection.getMetadata(this.entityClass).tableName

    const columnNames: string[] = []

    const placeholderRows: string[] = []

    const bindings: Array<string | number | boolean | null> = []
    // console.log(rows)
    // console.log(columns)

    let firstIteration = true
    for (const row of rows) {
      const placeholderRow: string[] = []

      for (const field in row) {
        // Shouldn't need to check if columns[field] exists
        // since that should be done in the reader.
        const column = columns[field]
        const placeholder = await column.getPlaceholder()
        placeholderRow.push(placeholder)

        if (placeholder.includes('?')) {
          bindings.push(row[field])
        }

        if (firstIteration) {
          columnNames.push(column.getDatabaseFieldName())
        }
      }

      firstIteration = false

      placeholderRows.push(placeholderRow.join(', '))
    }

    const values = '(' + placeholderRows.join('),\n(') + ')'

    const sql = `INSERT INTO ${table}\n(${columnNames})\nVALUES\n${values}`

    console.log(sql)

    const result = await manager.query(sql, bindings)
  }
}

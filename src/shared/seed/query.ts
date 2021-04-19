import { getConnection } from 'typeorm'

export class Query {
  constructor(private entityClass: Function, private columns: object) {}

  async handle(rows: object[]) {
    const columns = this.columns
    const connection = getConnection()
    const manager = connection.manager

    const table = connection.getMetadata(this.entityClass).tableName

    const columnNames = Object.keys(columns)

    const placeholderRows: string[] = []

    const parameters: Array<string | number | boolean | null> = []
    // console.log(rows)
    // console.log(columns)

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

    const values = '(' + placeholderRows.join('),\n(') + ')'

    const sql = `INSERT INTO ${table}\n(${columnNames})\nVALUES\n${values}`

    console.log(sql, parameters)

    const result = await manager.query(sql, parameters)
  }
}

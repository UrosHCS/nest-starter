import * as parse from 'csv-parse'
import * as fs from 'fs'
import { SeedException } from './exceptions/seed.exception'

const BUFFER_LENGTH = 3

interface Processor {
  handle(rows: object[]): Promise<void>
}

export class Reader {
  private rowCount: number

  private rows: object[] = []

  private bufferCount = 0

  private headers: string[]

  constructor(
    /**
     * Path to a csv file that should be read
     */
    private path: string,
    /**
     * Fields (headers) that should be extracted from the csv file
     */
    private fields: string[],
    /**
     * Object that does something with the data
     * from the csv file as it comes in.
     */
    private processor: Processor
  ) {}

  async read() {
    if (!fs.existsSync(this.path)) {
      throw new SeedException(`File ${this.path} does not exist.`)
    }

    const csvStream = this.createCsvStream()

    let rowCount = 0

    try {
      for await (const row of csvStream) {
        rowCount++
        await this.processRow(row)
      }

      await this.onEnd(rowCount)
    } catch (error: unknown) {
      this.handleError(error)
    }
  }

  private createCsvStream() {
    return fs.createReadStream(this.path)
      .pipe(parse({
        // Byte order mark? What is that?
        bom: true,
        // Specify fields so that the data returns as objects
        columns: (headers: string[]) => this.validateHeaders(headers),
      }))
  }

  private validateHeaders(headers: string[]): string[] {
    const expected = this.fields

    if (headers.length !== expected.length) {
      throw new SeedException('Definition columns count and csv columns count do not match.')
    }

    const sortedExpected = expected.slice().sort()
    const sortedHeaders = headers.slice().sort()

    if (!sortedHeaders.every((value, index) => value === sortedExpected[index])) {
      throw new SeedException('Headers from csv file do not match the expected headers.')
    }

    return this.headers = headers
  }

  private handleError(error: unknown) {
    throw new SeedException('Parse error: ' + error)
  }

  private async processRow(data: object) {
    this.rows.push(data)
    this.bufferCount++

    if (this.bufferCount === BUFFER_LENGTH) {
      // Here, this.rows has length of BUFFER_LENGTH
      // or potentially less if it is the end of the stream.
      await this.processRows()
      this.resetRows()
    }
  }

  private processRows(): Promise<void> {
    return this.processor.handle(this.rows)
  }

  private resetRows() {
    this.bufferCount = 0
    this.rows = []
  }

  private async onEnd(rowCount: number) {
    this.rowCount = rowCount

    if (this.rows.length) {
      await this.processRows()
    }
  }
}

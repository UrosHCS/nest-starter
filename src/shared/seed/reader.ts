import * as parse from 'csv-parse'
import * as fs from 'fs'
// import { finished as originalFinished } from 'stream'
// import { promisify } from 'util'
import { SeedException } from './seed.exception'

// const finished = promisify(originalFinished)

const BUFFER_LENGTH = 3

interface Processor {
  handle(rows: object[]): void
}

export class Reader {
  private rowCount: number

  private rows: object[] = []

  private bufferCount = 0

  private headers: string[]

  constructor(private path: string, private columns: object, private processor: Processor) {}

  async read() {
    if (!fs.existsSync(this.path)) {
      throw new SeedException(`File ${this.path} does not exist.`)
    }

    const parser = fs
      .createReadStream(this.path)
      .pipe(parse({
        bom: true,
        columns: Object.keys(this.columns),
        from: 2,
      }));

    try {
      for await (const record of parser) {
        // Work with each record
        this.onData(record)
      }
    } catch (error: unknown) {
      this.onError(error)
    }
  }

  onHeaders(headers: string[]) {
    if (!Array.isArray(headers)) {
      throw new Error('Headers not parsed')
    }

    const expectedHeaders = Object.keys(this.columns)

    if (headers.length !== expectedHeaders.length) {
      throw new Error('Definition columns count and csv columns count do not match.')
    }

    expectedHeaders.sort()
    headers.sort()

    if (!headers.every((value, index) => value === expectedHeaders[index])) {
      throw new Error('Definition columns count and csv columns count do not match.')
    }

    this.headers = headers
  }

  onError(error: unknown) {
    throw new SeedException('Parse error: ' + error)
  }

  onData(data: object) {
    this.rows.push(data)
    this.bufferCount++

    if (this.bufferCount === BUFFER_LENGTH) {
      this.processRows()
      this.resetRows()
    }
  }

  processRows() {
    // Here, this.rows has length of BUFFER_LENGTH
    // or potentially less if it is the end of the stream.

    this.processor.handle(this.rows)
  }

  resetRows() {
    this.bufferCount = 0
    this.rows = []
  }

  onEnd(rowCount: number) {
    this.rowCount = rowCount

    if (this.rows.length) {
      this.processRows()
    }
  }
}

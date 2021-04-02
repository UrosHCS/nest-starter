const { parseStream } = require('@fast-csv/parse')
const fs = require('fs')

class Reader {
  rows = []

  async read(stream) {
    parseStream(stream, {headers: true})
      .on('headers', this.onHeaders.bind(this))
      .on('error', this.onError.bind(this))
      .on('data', this.onData.bind(this))
      .on('end', this.onEnd.bind(this))
  }

  onHeaders(headers) {
    if (!Array.isArray(headers)) {
      throw new Error('Headers not parsed')
    }
  }

  onError(error) {
    throw new Error('Parse error: ' + error)
  }

  onData(data) {
    this.rows.push(data)
  }

  onEnd(rowCount) {
    this.rowCount = rowCount
    console.log(this)
  }
}

let reader = new Reader()

reader.read('src/user/seed/user.seed.csv')
import * as request from 'supertest'

interface Headers {
  [key: string]: string
}

export class Request {
  private headers: Headers = {}
  private server: any

  setHeader(key: string, value: string) {
    this.headers[key] = value
  }

  setServer(server: any) {
    this.server = server
  }

  get(url: string) {
    return this.req().get(url).set(this.headers)
  }

  post(url: string) {
    return this.req().post(url).set(this.headers)
  }

  put(url: string) {
    return this.req().put(url).set(this.headers)
  }

  delete(url: string) {
    return this.req().delete(url).set(this.headers)
  }

  patch(url: string) {
    return this.req().get(url).set(this.headers)
  }

  private req() {
    if (!this.server) {
      throw new Error('Server not set. Call setServer method and pass app.getHttpServer() to it.')
    }

    return request(this.server)
  }
}

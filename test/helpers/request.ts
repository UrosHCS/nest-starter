import * as request from 'supertest'

export class Request {
    private authToken: string
    private server: any

    setToken(authToken: string) {
        this.authToken = authToken
    }

    setServer(server: any) {
        this.server = server
    }

    get(url: string) {
        const req = this.makeRequest().get(url)

        this.authorizeOrNot(req)

        return req
    }

    post(url: string) {
        const req = this.makeRequest().post(url)

        this.authorizeOrNot(req)

        return req
    }

    put(url: string) {
        const req = this.makeRequest().put(url)

        this.authorizeOrNot(req)

        return req
    }

    delete(url: string) {
        const req = this.makeRequest().delete(url)

        this.authorizeOrNot(req)

        return req
    }

    patch(url: string) {
        const req = this.makeRequest().get(url)

        this.authorizeOrNot(req)

        return req
    }

    private makeRequest() {
        return request(this.server)
    }

    private authorizeOrNot(req: request.Test): void {
        if (! this.authToken) {
            return;
        }

        req.set('Authorization', 'Bearer: ' + this.authToken)
    }
}
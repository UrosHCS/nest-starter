import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'

export abstract class TransformRequest implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.cleanRequest(context.switchToHttp().getRequest())
    return next.handle()
  }

  cleanRequest(req: any): void {
    req.query = this.cleanObject(req.query)
    req.params = this.cleanObject(req.params)

    if (req.method !== 'GET') {
      req.body = this.cleanObject(req.body)
    }
  }

  cleanObject(obj: object | null | undefined) {
    if (!obj) {
      return obj
    }

    for (const key in obj) {
      // Prototype of obj is null
      // if (!obj.hasOwnProperty(key)) {
      //   continue
      // }

      const value = obj[key]

      // If the value is another nested object we need to recursively
      // clean it too. This will work for both array and object.
      if (value instanceof Object) {
        this.cleanObject(value)
      } else {
        // If the value is not an object then it's a scalar
        // so we just let it be transformed.
        obj[key] = this.transform(key, value)
      }
    }

    return obj
  }

  abstract transform(key: string | number, value: boolean | number | string | null | undefined): any
}

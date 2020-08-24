import { Injectable } from '@nestjs/common'
import { TransformRequest } from './transform.request'

@Injectable()
export class TrimStrings extends TransformRequest {
  private except = ['password']

  transform(key: string | number, value: any) {
    if (this.isString(value) && this.isString(key) && !this.except.includes(key)) {
      return value.trim()
    }

    return value
  }

  isString(value: any): value is string {
    return typeof value === 'string' || value instanceof String
  }
}

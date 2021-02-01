import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    res.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    })
  }
}

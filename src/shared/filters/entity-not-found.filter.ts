import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply, RawServerDefault } from 'fastify'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError.js'

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply<RawServerDefault>>()

    response.code(404).send({
      statusCode: 404,
      error: 'Not found',
      message: exception.message,
    })
  }
}

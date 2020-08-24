import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ServerResponse } from 'http'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply<ServerResponse>>()

    response.code(404).send({
      statusCode: 404,
      error: 'Not found',
      message: exception.message,
    })
  }
}

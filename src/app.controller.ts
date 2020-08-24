import { Controller, Get, Headers, Query } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  test(@Query() query: any, @Headers() headers: any) {
    return {
      query,
      headers,
    }
  }
}

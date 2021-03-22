import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const openApi = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Generic backend REST API')
    .setDescription('Local, google and facebook login/register')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)
}

import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common'
import { WsAdapter } from '@nestjs/platform-ws'
import { useContainer } from 'class-validator'
import { AppModule } from './app/app.module'

// If you need to you can set nest as a container for typeorm also
// import { useContainer as containerForTypeorm } from 'typeorm'

// The purpose of this method is to set up the app the same way when
// running it and in tests. The app instance is created in
// different ways but this setup is and must be the same.
export const appSetup = (app: INestApplication) => {
  // Here we tell nest to use validation on every request
  app.useGlobalPipes(
    // Global validation pipe allows us to use decorators
    // in the DTOs in order to validate user input.
    new ValidationPipe({
      // When whitelist is true, validation pipe will remove all
      // properties that are not in the type-hinted dto.
      whitelist: true,
      // This option will tell the pipe to transform payloads
      // to be objects typed according to their DTO classes.
      transform: true,
      // Expose more details about the error, like it was in Nest 6.
      exceptionFactory: (errors) => new BadRequestException(errors),
      // If the value is sensitive (like a password) it's better not
      // to return it in the error object.
      validationError: {
        target: false,
        value: false,
      },
    }),
  )

  // Here we tell nest to use the ws library
  app.useWebSocketAdapter(new WsAdapter(app))

  // Tell the class-validator to use the nest container instead of the
  // default one.
  useContainer(
    // The first argument to useContainer() can be "app.select(AppModule)" or
    // it can be just "app". If it's just app then you get some errors that
    // are not self-explanatory. Some tests even passed with just app as
    // the first argument even though the tested endpoints actually broke.
    app.select(AppModule),
    {
      // If the nest container doesn't find anything it will throw an
      // exception, so we tell the class-validator to catch that error
      // and fallback to the default container.
      fallbackOnErrors: true,
    },
  )
}

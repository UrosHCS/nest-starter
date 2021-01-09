import { Global, Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { EntityNotFoundFilter } from './filters/entity-not-found.filter'
import { TrimStrings } from './interceptors/trim.strings'
import { Exists } from './validators/exists'
// import { IsInCaseInsensitive } from './validators/is.in.case.insensitive'

@Global()
@Module({
  providers: [
    {
      // By using the APP_INTERCEPTOR token, the TrimStrings class is
      // automatically used as an app-level interceptor.
      provide: APP_INTERCEPTOR,
      useClass: TrimStrings,
    },
    {
      // By using the APP_FILTER token, the EntityNotFoundFilter class is
      // automatically used as an app-level exception filter.
      provide: APP_FILTER,
      useClass: EntityNotFoundFilter,
    },
    // We have to register Exists as a provider because it has dependencies
    // injected into its constructor.
    Exists,
    // IsInCaseInsensitive does not have any DI so we don't have to register it in the module.
    // IsInCaseInsensitive,
  ],
  exports: [
    Exists,
    // IsInCaseInsensitive,
  ],
})
export class SharedModule {}

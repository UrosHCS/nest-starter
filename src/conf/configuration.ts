import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NoInferType } from '@nestjs/config/dist/types'

@Injectable()
export class Configuration {
  constructor(
    @Inject('CONFIG_OPTIONS') private readonly options: object,
    private readonly configService: ConfigService,
  ) {
    const file = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  }

  env<T>(name: string): string | boolean | null {
    return true
  }

  get<T>(propertyPath: string, defaultValue: NoInferType<T>): T | undefined {
    return this.configService.get<T>(propertyPath, defaultValue)
  }

  getStrict<T>(propertyPath: string): T {
    const value = this.configService.get<T>(propertyPath)

    if (!value) {
      throw new InternalServerErrorException(
        `Couldn't find a config value for path [${propertyPath}]`,
      )
    }

    return value
  }
}

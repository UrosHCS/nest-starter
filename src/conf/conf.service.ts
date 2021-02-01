import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NoInferType } from '@nestjs/config/dist/types'
import { JwtModuleOptions } from '@nestjs/jwt'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class ConfService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  get jwt(): JwtModuleOptions {
    return this.getStrict<JwtModuleOptions>('jwt')
  }

  get database(): TypeOrmModuleOptions {
    return this.getStrict<TypeOrmModuleOptions>('database')
  }

  get google() {
    return this.getStrict('google')
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

  /**
   * This method is automatically called by TypeOrmModule forRootAsync useExisting
   */
  createTypeOrmOptions(connectionName?: string | undefined) {
    return this.database
  }
}

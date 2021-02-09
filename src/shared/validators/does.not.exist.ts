import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Connection } from 'typeorm'

// This validator checks if an entity exists in the database by a specific field
@ValidatorConstraint({ name: 'doesNotExist', async: true })
@Injectable()
export class DoesNotExist implements ValidatorConstraintInterface {
  constructor(private readonly connection: Connection) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const [entityClass, field] = this.parseArgs(args)

    const row = await this.connection
      .getRepository(entityClass)
      .createQueryBuilder()
      .select('id')
      .where({ [field]: value })
      .getRawOne()

    const exists: boolean = row?.id

    return !exists
  }

  defaultMessage(args: ValidationArguments): string {
    const [entityConstructor, field] = this.parseArgs(args)

    return `${entityConstructor.name} with that ${field} already exists.`
  }

  private parseArgs(args: ValidationArguments): [Function, string] {
    // First argument must be an entity class from which we resolve a repository
    const entityConstructor: Function = args.constraints[0]
    // Second argument is optional and it is the column in which to search
    // for the passed value. Defaults to 'id'.
    const field: string = args.constraints[1] || 'id'

    return [entityConstructor, field]
  }
}

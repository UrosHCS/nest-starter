import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'isInCaseInsensitive', async: false })
@Injectable()
export class IsInCaseInsensitive implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const values = this.parseArgs(args)

    return values.includes(value.toLowerCase())
  }

  defaultMessage(args: ValidationArguments): string {
    const values = this.parseArgs(args)

    const valuesString = values.concat(values.map((value) => value.toUpperCase())).join(', ')

    return `The property "${args.property}" must be one of: ${valuesString}. Value "${args.value}" given.`
  }

  private parseArgs(args: ValidationArguments): string[] {
    // First argument must be an array of values.
    const values: string[] = args.constraints[0]

    return values
  }
}

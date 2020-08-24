import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

export interface NumericOptions {
  int?: boolean
  min?: number
  max?: number
}

@ValidatorConstraint({ name: 'IsNumeric', async: false })
@Injectable()
export class IsNumeric implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const options = this.parseArgs(args)

    const number = Number(value)

    if (isNaN(number)) {
      return false
    }

    if (options.int && !Number.isInteger(number)) {
      return false
    }

    if (typeof options.min === 'number' && number < options.min) {
      return false
    }

    if (typeof options.max === 'number' && number < options.max) {
      return false
    }

    return true
  }

  defaultMessage(args: ValidationArguments): string {
    const options = this.parseArgs(args)

    const typeMessage = options.int ? 'an integer' : 'a number'
    const minMessage = options.min ? `, min ${options.min}` : ''
    const maxMessage = options.max ? `, max ${options.max}` : ''

    return `${args.property} must be ${typeMessage}${minMessage}${maxMessage}.`
  }

  private parseArgs(args: ValidationArguments) {
    // First argument must be an options object.
    const options: NumericOptions = args.constraints[0]

    return options
  }
}

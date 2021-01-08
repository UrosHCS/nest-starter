import { IsEmail, Length, Validate } from 'class-validator'
import { User } from '../../database/entities/user.entity.js'
import { Exists } from '../../shared/validators/exists.js'

export class RegisterDto {
  @IsEmail()
  @Validate(Exists, [User, 'email'])
  email: string

  @Length(8, 255)
  password: string
}

import { IsEmail, Length, Validate } from 'class-validator'
import { User } from 'src/database/entities/user.entity'
import { Exists } from 'src/shared/validators/exists'

export class RegisterDto {
  @IsEmail()
  @Validate(Exists, [User, 'email'])
  email: string

  @Length(8, 255)
  password: string
}

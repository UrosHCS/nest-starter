import { IsEmail, Length, Validate } from 'class-validator'
import { Exists } from 'src/shared/validators/exists'
import { User } from 'src/users/user.entity'

export class RegisterDto {
  @IsEmail()
  @Validate(Exists, [User, 'email'])
  email: string

  @Length(8, 255)
  password: string
}

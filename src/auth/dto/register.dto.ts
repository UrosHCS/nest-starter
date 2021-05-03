import { IsEmail, Length, Validate } from 'class-validator'
import { DoesNotExist } from 'src/shared/validators/does.not.exist'
import { User } from 'src/user/entities/user.entity'

export class RegisterDto {
  @IsEmail()
  @Validate(DoesNotExist, [User, 'email'])
  email: string

  @Length(8, 255)
  password: string
}

import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Min } from 'class-validator'
import { User } from 'src/users/user.entity'

const userFields: Array<keyof User> = ['id', 'email', 'role', 'createdAt', 'updatedAt']

export class UsersFilter {
  @IsOptional()
  @IsIn(userFields)
  order?: keyof User

  @IsOptional()
  @IsIn(['asc', 'desc'])
  direction?: 'asc' | 'desc' | 'ASC' | 'DESC'

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}

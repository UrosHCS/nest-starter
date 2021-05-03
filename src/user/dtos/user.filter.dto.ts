import { Type } from 'class-transformer'
import { IsIn, IsInt, Min } from 'class-validator'
import { User } from 'src/user/entities/user.entity'

const userFields: Array<keyof User> = ['id', 'email', 'role', 'createdAt', 'updatedAt']

export class UserFilter {
  @IsIn(userFields)
  order: keyof User = 'id'

  @IsIn(['asc', 'desc'])
  direction: 'asc' | 'desc' = 'asc'

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10
}

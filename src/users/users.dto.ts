import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Min, Validate } from 'class-validator'
import { safeUserFields, User } from 'src/database/entities/user.entity'
import { IsInCaseInsensitive } from 'src/shared/validators/is-in-case-insensitive'

export class UsersFilter {
  @IsOptional()
  @IsIn(safeUserFields)
  order?: keyof User

  @IsOptional()
  @Validate(IsInCaseInsensitive, [['asc', 'desc']])
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

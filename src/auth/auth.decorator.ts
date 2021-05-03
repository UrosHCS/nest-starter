import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Role } from 'src/user/entities/user.entity'
import { RolesGuard } from './roles.guard'

export function Auth(...roles: Array<keyof typeof Role>) {
  return applyDecorators(
    SetMetadata('roles', roles),
    // If AuthGuard class is just passed instead of called
    // we get error "TypeError: metatype is not a constructor"
    UseGuards(AuthGuard(), RolesGuard),
  )
}

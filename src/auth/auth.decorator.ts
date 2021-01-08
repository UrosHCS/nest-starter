import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Role } from '../database/entities/user.entity.js'
import { RolesGuard } from './roles.guard.js'

export function Auth(...roles: Array<keyof typeof Role>) {
  return applyDecorators(
    SetMetadata('roles', roles),
    // If AuthGuard class is just passed instead of called
    // we get error "TypeError: metatype is not a constructor"
    UseGuards(AuthGuard(), RolesGuard),
  )
}

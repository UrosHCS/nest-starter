import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Roles are set with SetMetadata('roles', roles)
    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    // If no roles are specified it means every role is permitted
    if (!roles.length) {
      return true
    }

    const user: User | undefined = context.switchToHttp().getRequest().user

    if (!user) {
      throw new UnauthorizedException(
        'There is no user logged in so role check cannot be performed.',
      )
    }

    // if a role is specified it means that the user must be one of those roles
    if (!roles.includes(user.role)) {
      throw new UnauthorizedException(`User with role [${user.role}] is forbidden on this endpoint`)
    }

    return true
  }
}

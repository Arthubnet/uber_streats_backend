import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AllowedRoles } from './role.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} // We are getting metadata using this constructor
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>( //this will catch @Role decorator from resolver function
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    console.log(roles);
    const gqlContext = GqlExecutionContext.create(context).getContext(); //we kind of convert context data to graphql data type, it still has the user we need
    const user: User = gqlContext['user'];
    //if there is a user (that we got from the context that got it from the header) the request will be allowed
    //so we can use AuthGuard as decorator in resolver to figure out whether allow request or not
    if (!user) {
      return false;
    }
    if (roles.includes('Any')) {
      return true;
    }
    return roles.includes(user.role);
  }
}

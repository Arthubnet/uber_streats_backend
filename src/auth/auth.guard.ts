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
    // this if means if there is no Role(metadata) required on resolver, it means it's publick and everyone can use it(for example create an account)
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext(); //we kind of convert context data to graphql data type, it still has the user we need
    const user: User = gqlContext['user'];
    //if there is a user (that we got from the context that got it from the header) the request will be allowed
    //so we can use AuthGuard as decorator in resolver to figure out whether allow request or not
    if (!user) {
      return false;
    }
    //if there is a user but role is Any, we let the user go further, because Any means every logged user can proceed
    if (roles.includes('Any')) {
      return true;
    }
    // if the role of the user matches the role of the resolver that is required, then user approved to go further
    return roles.includes(user.role);
  }
}

/* Basically we check two things here :
1. Whether there is a user or not(logged in or not. checking it by token in header)
2. The role of the resolver and User

So if canActivate function returns true - user goes further, if false - user stopped
*/

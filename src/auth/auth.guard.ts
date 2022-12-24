import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext(); //we kind of convert context data to graphql data type, it still has the user we need
    const user = gqlContext['user'];
    //if there is a user (that we got from the context that got it from the header) the request will be allowed
    //so we can use AuthGuard as decorator in resolver to figure out whether allow request or not
    if (!user) {
      return false;
    }
    return true;
  }
}

import { NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from './../users/users.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  // Taking request from the header
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        //checks if there is "id" inside of the decoded header
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          //if there is 'id', finds the user in DB through userService
          const user = await this.usersService.findById(decoded['id']);
          //adding a user to the request, so it can go further(in our case context will provide it to all the resolvers)
          req['user'] = user;
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}

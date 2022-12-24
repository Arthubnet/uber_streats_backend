import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { JwtMiddleWare } from './../jwt/jwt.middleware';
import { Verification } from './entities/verification.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])], //with this import we have access to their Repositories
  providers: [UsersResolver, UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleWare)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL }); // we apply middleware only to grapthql path, both post and set
  }
}

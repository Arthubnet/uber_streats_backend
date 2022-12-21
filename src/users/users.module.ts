import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/jwt/jwt.module';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { JwtMiddleWare } from './../jwt/jwt.middleware';
import { Verification } from './entities/verification.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verification]),
    ConfigModule,
    JwtModule,
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleWare)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}

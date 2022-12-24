import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIG_OPTIONS } from './jwt.constants';

@Module({})
@Global() //because it's global, we don't need to import it directly in User Module
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    //DynamicModule is a module that returns another module
    return {
      module: JwtModule,
      imports: [ConfigModule],
      providers: [
        {
          /* That is how we pass arguments to the service  */
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}

import {DynamicModule, Module, OnModuleInit} from '@nestjs/common';
import {MikroOrmModule} from 'nestjs-mikro-orm';

import {ConfigService} from '../config';
import {ConfigModule} from '../config/config.module';
import {EventBusModule} from '../event-bus/event-bus.module';

import {PasswordCipher} from './helpers/PasswordCipher';
import {VerificationTokenGenerator} from './helpers/verification-token-generator';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';

let defaultOrmModule: DynamicModule;
const services = [
  ConfigService,
  AuthService,
  UserService,
];
const helpers = [
  PasswordCipher,
  VerificationTokenGenerator,
];

@Module({
  imports: [ ConfigModule, EventBusModule ],
  providers: [ ...services, ...helpers ],
  exports: [ ...services, ...helpers ],
})
export class ServiceCoreModule implements OnModuleInit {
  async onModuleInit() {
    // init global setting
    // init roles
    // init administrators
    // init payment
  }
}

@Module({
  imports: [ ServiceCoreModule ],
  exports: [ ServiceCoreModule ]
})
export class ServiceModule {
  static forRoot(): DynamicModule {
    if (!defaultOrmModule) {
      defaultOrmModule = MikroOrmModule.forRootAsync({
        imports: [ ConfigModule ],
        useFactory: (configService: ConfigService) => {
          return configService.dbConnectionOptions;
        },
        inject: [ ConfigService ],
      });
    }
    return {
      module: ServiceModule,
      imports: [ defaultOrmModule ],
    };
  }
}

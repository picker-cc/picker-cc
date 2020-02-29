import {DynamicModule, Module, OnModuleInit} from '@nestjs/common';
import {MikroOrmModule} from 'nestjs-mikro-orm';

import {ConfigService} from '../config';
import {ConfigModule} from '../config/config.module';
import {EventBusModule} from '../event-bus';

import {ListQueryBuilder} from './helpers/list-query-builder/list-query-builder';
import {PasswordCipher} from './helpers/PasswordCipher';
import {VerificationTokenGenerator} from './helpers/verification-token-generator';
import {AssetService} from './services/asset.service';
import {AuthService} from './services/auth.service';
import {PostService} from './services/post.service';
import {UserService} from './services/user.service';

let defaultOrmModule: DynamicModule;
const services = [
  ConfigService,
  AuthService,
  UserService,
  PostService,
  AssetService,
];
const helpers = [
  PasswordCipher,
  VerificationTokenGenerator,
  ListQueryBuilder
];

@Module({
  imports: [ ConfigModule, EventBusModule ],
  providers: [ ...services, ...helpers ],
  exports: [ ...services, ...helpers ],
})
export class ServiceCoreModule implements OnModuleInit {
  async onModuleInit() {
    // await this.globalSettingsService.initGlobalSettings();
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

  static forWorker(): DynamicModule {
    // if (!workerTypeOrmModule) {
    //   workerTypeOrmModule = TypeOrmModule.forRootAsync({
    //     imports: [ ConfigModule ],
    //     useFactory: (configService: ConfigService) => {
    //       const {dbConnectionOptions, workerOptions} = configService;
    //       if (workerOptions.runInMainProcess) {
    //         // When running in the main process, we can re-use the existing
    //         // default connection.
    //         return {
    //           ...dbConnectionOptions,
    //           name: 'default',
    //           keepConnectionAlive: true,
    //         };
    //       } else {
    //         return {
    //           ...dbConnectionOptions,
    //         };
    //       }
    //     },
    //     inject: [ ConfigService ],
    //   });
    // }
    return {
      module: ServiceModule,
      // imports: [ workerTypeOrmModule ],
      // controllers: workerControllers,
    };
  }

  static forPlugin(): DynamicModule {
    return {
      module: ServiceModule,
      // imports: [ TypeOrmModule.forFeature() ],
    };
  }
}

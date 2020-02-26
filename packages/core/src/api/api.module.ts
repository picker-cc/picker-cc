import {Module} from '@nestjs/common';
import {APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import path from 'path';

import {ServiceModule} from '../service/service.module';

import {ApiSharedModule, SnsApiModule} from './api-internal-modules';
import {RequestContextService} from './common/request-context.service';
import {configureGraphQLModule} from './config/configure-graphql-module';
import {AuthGuard} from './middleware/auth-guard';
import {IdInterceptor} from './middleware/id-interceptor';

@Module({
  imports: [
    // 数据库连接以及所有的业务层
    ServiceModule.forRoot(),
    ApiSharedModule,
    SnsApiModule,
    configureGraphQLModule(configService => ({
      apiType: 'sns',
      apiPath: configService.snsApiPath,
      typePaths: [ 'type', 'sns-api', 'common' ].map(p =>
        path.join(__dirname, 'schema', p, '*.graphql')
      ),
      resolverModule: SnsApiModule
    }))
  ],
  providers: [
    RequestContextService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdInterceptor,
    },
  ]
})
export class ApiModule {
}

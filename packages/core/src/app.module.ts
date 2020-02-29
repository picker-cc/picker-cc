import {MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, OnApplicationShutdown} from '@nestjs/common';
import {RequestHandler} from 'express';

import {ApiModule} from './api/api.module';
import {ConfigService, Logger} from './config';
import {ConfigModule} from './config/config.module';
import {PluginModule} from './plugin/plugin.module';

/**
 * 应用主模块
 */
@Module({
  imports: [ ConfigModule, ApiModule, PluginModule.forRoot() ]
})
export class AppModule implements NestModule, OnApplicationShutdown {
  constructor(private configService: ConfigService) {
  }

  configure(consumer: MiddlewareConsumer) {
    const {snsApiPath} = this.configService;
    // const i18nextHandler = this.i18nService.handle();
    const defaultMiddleware: Array<{ handler: RequestHandler; route?: string }> = [
      //   { handler: , route: snsApiPath },
      // { handler: i18nextHandler, route: shopApiPath },
    ];
    // const defaultMiddleware: Array<{ handler: RequestHandler, route?: string }> = [];
    const allMiddleware = defaultMiddleware.concat(this.configService.middleware);
    const middlewareByRoute = this.groupMiddlewareByRoute(allMiddleware);
    for (const [ route, handlers ] of Object.entries(middlewareByRoute)) {
      consumer.apply(...handlers).forRoutes(route);
    }
  }

  onApplicationShutdown(signal?: string): any {
    if (signal) {
      Logger.info('Received shutdown signal: ' + signal);
    }
  }

  /**
   * Groups middleware handlers together in an object with the route as the key.
   */
  private groupMiddlewareByRoute(
    middlewareArray: Array<{ handler: RequestHandler; route?: string }>,
  ): { [route: string]: RequestHandler[] } {
    const result = {} as { [route: string]: RequestHandler[] };
    for (const middleware of middlewareArray) {
      const route = middleware.route || this.configService.adminApiPath;
      if (!result[route]) {
        result[route] = [];
      }
      result[route].push(middleware.handler);
    }
    return result;
  }

}

import {MiddlewareConsumer, Module, NestModule, OnApplicationShutdown, OnModuleInit} from "@nestjs/common";
import {Middleware, MiddlewareHandler} from "./common";
import {ConfigModule, ConfigService, Logger} from "./config";
import {I18nModule} from "./i18n/i18n.module";

// import {PluginModule} from "./plugin/plugin.module";
import {I18nService} from "./i18n";
// import {configureGraphQLModule} from "./api/config/configure-graphql-module";
// import {join} from "path";
// import {RequestContextService} from "./api/common/request-context.service";
// import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
// import {AuthGuard} from "./api/middleware/auth-guard";
// import {TranslateErrorResultInterceptor} from "./api/middleware/translate-error-result-interceptor";
// import {ExceptionLoggerFilter} from "./api/middleware/exception-logger.filter";
// import {ServiceModule} from "./service/service.module";
import {ApiModule} from "./api/api.module";
import {PluginModule} from "./plugin/plugin.module";
import {ServiceModule} from "./service/service.module";
import {RequestContextService} from "./api/common/request-context.service";
import {AuthGuard} from "./api/middleware/auth-guard";
import {APP_GUARD} from "@nestjs/core";

@Module({
    imports: [
        // ProcessContextModule,
        ConfigModule,
        I18nModule,
        ApiModule,
        PluginModule.forRoot(),
        ServiceModule.forRoot(),
        // ConnectionModule,
    ],
    // providers: [ InitializerService, ]
    providers: [
        RequestContextService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ]
})
export class AppModule implements NestModule, OnApplicationShutdown {
    constructor(
        private configService: ConfigService,
        private i18nService: I18nService,
    ) {
    }

    configure(consumer: MiddlewareConsumer): any {
        const {adminApiPath, studioApiPath, middleware} = this.configService.apiOptions;
        const i18nextHandler = this.i18nService.handle();
        const defaultMiddleware: Middleware[] = [
            {handler: i18nextHandler, route: adminApiPath},
            {handler: i18nextHandler, route: studioApiPath},
        ];
        const allMiddleware = defaultMiddleware.concat(middleware);
        const consumableMiddlewares = allMiddleware.filter(mid => !mid.beforeListen);
        const middlewareByRoute = this.groupMiddlewareByRoute(consumableMiddlewares);
        for (const [ route, handlers ] of Object.entries(middlewareByRoute)) {
            consumer.apply(...handlers).forRoutes(route);
        }
    }

    // async onModuleInit() {
    //     await this.initializerService.init()
    // }

    async onApplicationShutdown(signal?: string) {
        if (signal) {
            Logger.info('收到服务关闭信号:' + signal);
        }
    }


    /**
     * 将中间件处理程序组合在一个对象中，以路由为键值。
     * @param middlewareArray
     * @private
     */
    private groupMiddlewareByRoute(middlewareArray: Middleware[]): { [route: string]: MiddlewareHandler[] } {
        const result = {} as { [route: string]: MiddlewareHandler[] };
        for (const middleware of middlewareArray) {
            const route = middleware.route || this.configService.apiOptions.adminApiPath;
            if (!result[route]) {
                result[route] = [];
            }
            result[route].push(middleware.handler);
        }
        return result;
    }
}

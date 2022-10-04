import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {join} from 'path';

import {ConfigModule, ConfigService} from "../config";
import {ServiceModule} from "../service/service.module";

import {configureGraphQLModule} from "./config/configure-graphql-module";
import {I18nModule} from "../i18n/i18n.module";
import {createDynamicGraphQlModulesForPlugins} from "../plugin/dynamic-plugin-api.module";

@Module({
    imports: [
        ConfigModule,
        I18nModule,
        ServiceModule,
        ...createDynamicGraphQlModulesForPlugins(),
        configureGraphQLModule(configService => ({
            // apiType: 'admin',
            apiPath: configService.apiOptions.appApiPath,
            playground: configService.apiOptions.appApiPlayground,
            debug: configService.apiOptions.appApiDebug,
            typePaths: [ 'app-api', 'common' ].map(p => join(__dirname, 'schema', p, '*.graphql')),
            // resolverModule: StudioApiModule,
            // validationRules: configService.apiOptions.appApiValidationRules   ,
        })),

    ],
    // exports: [
    //     ConfigModule,
    //     ServiceModule,
    // ],
    // providers: [
    //     RequestContextService,
    //     {
    //         provide: APP_GUARD,
    //         useClass: AuthGuard,
    //     },
    //     {
    //         provide: APP_INTERCEPTOR,
    //         useClass: TranslateErrorResultInterceptor,
    //     },
    //     {
    //         provide: APP_FILTER,
    //         useClass: ExceptionLoggerFilter,
    //     }
    // ]
})
export class ApiModule implements NestModule {
    constructor(private configService: ConfigService) {
    }

    configure(consumer: MiddlewareConsumer): any {
        // const { adminApiPath } = this.configService.apiOptions;
        // const { uploadMaxFileSize } = this.configService.assetOptions;

        // consumer
        //     .apply(graphqlUploadExpress({ maxFileSize: uploadMaxFileSize }))
        //     .forRoutes(adminApiPath);
    }
}

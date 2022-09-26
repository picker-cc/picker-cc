import {DynamicModule} from "@nestjs/common";
import {ConfigModule, ConfigService, PickerConfig} from "../../config";
import {buildSchema, extendSchema, graphql, GraphQLSchema, printSchema, ValidationContext} from "graphql";
import {ApiType} from "../common/get-api-type";

import path from "path";
import {generateListOptions} from "./generate-list-options";
import {generatePermissionEnum} from "./generate-permission";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {GqlModuleOptions, GraphQLModule, GraphQLTypesLoader} from "@nestjs/graphql";
import {I18nService} from '../../i18n/i18n.service';
import {I18nModule} from "../../i18n/i18n.module";
import {TranslateErrorsPlugin} from "../middleware/translate-errors-plugin";
import {generateErrorCodeEnum} from "./generate-error-code-enum";
import {generateAuthenticationTypes} from "./generate-auth-types";
import {ServiceModule} from "../../service/service.module";
import {getDynamicGraphQlModulesForPlugins} from "../../plugin/dynamic-plugin-api.module";
import {IncomingMessage, ServerResponse} from "http";
import {createSessionContext} from "../../schema/session";

// import {}
export interface GraphQLApiOptions {
    apiType: 'studio' | 'admin';
    typePaths: string[];
    apiPath: string;
    debug: boolean;
    playground: boolean | any;
    // tslint:disable-next-line:ban-types
    resolverModule?: Function;
    validationRules?: Array<(context: ValidationContext) => any>;
}

export function configureGraphQLModule(
    getOptions: (
        configService: ConfigService,
    ) => GraphQLApiOptions
): DynamicModule {
    return GraphQLModule.forRootAsync<ApolloDriverConfig>({
        driver: ApolloDriver,
        useFactory: (
            configService: ConfigService,
            // requestContextService: RequestContextService,
            i18nService: I18nService,
            // idCodecService: IdCodecService,
            typesLoader: GraphQLTypesLoader,
            // customFieldRelationResolverService: CustomFieldRe
        ) => {
            // const options = getOptions(configService);
            // console.log(options)
            return createGraphQLOptions(
                configService,
                i18nService,
                // requestContextService,
                // idCodecService,
                typesLoader,
                // customFieldRelationResolverService,
                getOptions(configService),
                // options,
            );
        },
        inject: [
            ConfigService,
            I18nService,
            GraphQLTypesLoader,
        ],
        imports: [
            ConfigModule,
            I18nModule,
            // ApiSharedModule,
            ServiceModule
        ],

    })
}

async function createGraphQLOptions(
    configService: ConfigService,
    i18nService: I18nService,
    // requestContextService: RequestContextService,
    // idCodecService: IdCodecService,
    typesLoader: GraphQLTypesLoader,
    options: GraphQLApiOptions,
): Promise<GqlModuleOptions> {

    // const builtSchema = await buildSchemaForApi(options.apiType);
    // mergeSchemas(builtSchema, getMyGraphQLSchema(builtSchema))
    // const resolvers = generateResolvers(
    //     configService,
    //     options.apiType,
    //     builtSchema,
    // );

    // const gqla = await graphql({schema: customSchema, source: "", contextValue:schemaContext})
    // console.log(configService.graphqlSchema)
    return {
        path: '/' + options.apiPath,
        // typeDefs: printSchema(builtSchema),
        include: [options.resolverModule, ...getDynamicGraphQlModulesForPlugins(options.apiType)],
        fieldResolverEnhancers: ['guards'],
        schema: configService.graphqlSchema,
        // resolvers,
        uploads: false,
        playground: options.playground || false,
        debug: options.debug || false,
        // req: IncomingMessage;
        // res: ServerResponse;
        context: async ({req, res}: {req: IncomingMessage, res: ServerResponse}) => {
            // const requestContext = requestContextService.create(req)
            // console.log(req)
            // console.log(requestContext)

            // console.log(
            //     configService.context
            // )
            // return configService.context
            // return req
            // const context = async ({ req, res }: { req: IncomingMessage; res: ServerResponse }) =>
            //     picker.createContext({
            //         sessionContext: sessionStrategy
            //             ? await createSessionContext(sessionStrategy, req, res, createContext)
            //             : undefined,
            //         req,
            //     });
            // userConfig.context = context
            // const context = configService.context
            // createSessionContext()
            // configService.context
            // const context =
            // configService.context = Object.assign({}, configService.context, createSessionContext())
            return configService.context({
                sessionContext: configService.schemaConfig.session
                    ? await createSessionContext(configService.schemaConfig.session, req, res, configService.context)
                    : undefined,
                req
            })
            // return configService.context
        },
        // 这是由Express cors插件处理
        cors: false,
        plugins: [
            // new TranslateErrorsPlugin(i18nService),
            // new AssetInterceptorPlugin(configService),
            ...configService.apiOptions.apolloServerPlugins,
        ],
        validationRules: options.validationRules,
        // introspection: true,
        introspection: configService.apiOptions.introspection ?? true,
    } as GqlModuleOptions;

    /**
     * 组合生成服务器的 GraphQL schema
     * 1. 在 `typePaths` 指定的 source .graphql 文件中定义的默认模式
     * 2. 在配置中定义的任何自定义字段
     * 3. 由插件定义的任何模式扩展
     *
     * @param apiType
     */
    async function buildSchemaForApi(apiType: ApiType): Promise<GraphQLSchema> {
        const customFields = configService.customFields;
        // 路径必须规范化以使用正斜杠分隔符。
        // 参考 https://github.com/nestjs/graphql/issues/336
        const normalizedPaths = options.typePaths.map(p => p.split(path.sep).join('/'));
        const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);
        const authStrategies =
            apiType === 'studio'
                ? configService.authOptions.studioAuthenticationStrategy
                : configService.authOptions.adminAuthenticationStrategy;
        let schema = buildSchema(typeDefs);

        // getPluginAPIExtensions(configService.plugins, apiType)
        //     .map(e => (typeof e.schema === 'function' ? e.schema() : e.schema))
        //     .filters(notNullOrUndefined)
        //     .forEach(documentNode => (schema = extendSchema(schema, documentNode)));

        schema = generateListOptions(schema);

        schema = generateErrorCodeEnum(schema);
        schema = generateAuthenticationTypes(schema, authStrategies);

        // schema = addGraphQLCustomFields(schema, customFields, apiType === 'shop');
        // if (apiType === 'admin') {
        //     schema = addServerConfigCustomFields(schema, customFields);
        // }
        schema = generatePermissionEnum(schema, configService.authOptions.customPermissions);

        return schema;
    }
}

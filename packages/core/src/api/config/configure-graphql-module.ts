import {DynamicModule} from '@nestjs/common';
import {GqlModuleOptions, GraphQLModule, GraphQLTypesLoader} from '@nestjs/graphql';
import {GraphQLUpload} from 'apollo-server-core';
import {buildSchema, printSchema} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import path from 'path';

import {ConfigService, Logger} from '../../config';
import {ConfigModule} from '../../config/config.module';
import {ApiSharedModule} from '../api-internal-modules';
// import {IdCodecService} from '../common/id-codec.service';

import {generateListOptions} from './generate-list-options';
import {AssetInterceptorPlugin} from '../middleware/asset-interceptor-plugin';
import {getDynamicGraphQlModulesForPlugins} from '../../plugin/dynamic-plugin-api.module';

export interface GraphQLApiOptions {
  apiType: 'sns' | 'admin';
  typePaths: string[];
  apiPath: string;
  // tslint:disable-next-line:ban-types
  resolverModule: Function;
}

/**
 * Dynamically generates a GraphQLModule according to the given config options.
 */
export function configureGraphQLModule(
  getOptions: (configService: ConfigService) => GraphQLApiOptions,
): DynamicModule {
  return GraphQLModule.forRootAsync({
    useFactory: (
      configService: ConfigService,
      // i18nService: I18nService,
      // idCodecService: IdCodecService,
      typesLoader: GraphQLTypesLoader,
    ) => {
      return createGraphQLOptions(
        // i18nService,
        configService,
        // idCodecService,
        typesLoader,
        getOptions(configService),
      );
    },
    inject: [ ConfigService, GraphQLTypesLoader ],
    imports: [ ConfigModule, ApiSharedModule ],
  });
}

async function createGraphQLOptions(
  configService: ConfigService,
  // idCodecService: IdCodecService,
  typesLoader: GraphQLTypesLoader,
  options: GraphQLApiOptions,
): Promise<GqlModuleOptions> {
  // Prevent `Type "Node" is missing a "resolveType" resolver.` warnings.
  // See https://github.com/apollographql/apollo-server/issues/1075
  const dummyResolveType = {
    __resolveType() {
      return null;
    },
  };

  return {
    path: '/' + options.apiPath,
    typeDefs: await createTypeDefs(options.apiType),
    include: [options.resolverModule, ...getDynamicGraphQlModulesForPlugins(options.apiType)],
    resolvers: {
      JSON: GraphQLJSON,
      // DateTime: GraphQLDateTime,
      Node: dummyResolveType,
      PaginatedList: dummyResolveType,
      Upload: GraphQLUpload || dummyResolveType,
    },
    uploads: {
      maxFileSize: configService.assetOptions.uploadMaxFileSize,
    },
    playground: {
      settings: {
        'request.credentials': 'include'
      } as any,
    },
    debug: true,
    // ???????????????????????????????????? canActive ????????????????????? graphql request ??????????????????
    context: (req: any) => req,
    // This is handled by the Express cors plugin
    cors: false,
    plugins: [
      new AssetInterceptorPlugin(configService),
      ...configService.apolloServerPlugins,
    ]
  } as GqlModuleOptions;

  async function createTypeDefs(apiType: 'sns' | 'admin'): Promise<string> {
    const normalizedPaths = options.typePaths.map(p => p.split(path.sep).join('/'));
    const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);
    let schema = buildSchema(typeDefs);
    schema = generateListOptions(schema);
    return printSchema(schema);
  }
}

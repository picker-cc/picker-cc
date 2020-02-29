import {Module} from '@nestjs/common';
import {METADATA} from '@nestjs/common/constants';
import {ModuleMetadata} from '@nestjs/common/interfaces';
import {pick} from '@picker-cc/common/lib/pick';
import {Type} from '@picker-cc/common/lib/shared-types';
import {DocumentNode} from 'graphql';

import {RuntimePickerConfig} from '../config/picker-config';

import {PLUGIN_METADATA} from './plugin-metadata';

/**
 * @description
 * 定义Picker插件的元数据。该接口是[Nestjs ModuleMetadata]的超集(https://docs.nestjs.com/modules)。
 * (允许定义`imports`、`exports`、`providers`和controller``)，意思是
 * 任何Nestjs模块都是有效的Picker插件。此外，PickerPluginMetadata允许定义
 * 特定于Picker的额外属性。
 *
 * @docsCategory plugin
 * @docsPage PickerPluginMetadata
 */
export interface PickerPluginMetadata extends ModuleMetadata {
  /**
   * @description
   * 一个可以在服务启动前修改{@link PickerConfig} 对象的函数
   */
  configuration?: PluginConfigurationFn;
  /**
   * @description
   * The plugin may extend the default Vendure GraphQL shop api by providing extended
   * schema definitions and any required resolvers.
   */
  shopApiExtensions?: APIExtensionDefinition;
  /**
   * @description
   * 扩展默认的 Picker GraphQL 管理 api 提供扩展模式定义和任何需要的解析器
   */
  adminApiExtensions?: APIExtensionDefinition;
  /**
   * @description
   * 插件可以定义 [Nestjs microservice controllers](https://docs.nestjs.com/microservices/basics#request-response)
   * 并在 Worker 上下文中运行
   */
  workers?: Array<Type<any>>;
  /**
   * @description
   * 这个插件可以自定义实体 [TypeORM database entities](https://typeorm.io/#/entities).
   */
  entities?: Array<Type<any>>;
}

/**
 * @description
 * 允许插件扩展Picker GraphQL API的对象。
 *
 * @docsCategory plugin
 * @docsPage PickerPluginMetadata
 * */

export interface APIExtensionDefinition {
  /**
   * @description
   * Extensions to the schema.
   *
   * @example
   * ```TypeScript
   * const schema = gql`extend type SearchReindexResponse {
   *     timeTaken: Int!
   *     indexedItemCount: Int!
   * }`;
   * ```
   */
  schema?: DocumentNode | (() => DocumentNode);
  /**
   * @description
   * An array of resolvers for the schema extensions. Should be defined as [Nestjs GraphQL resolver](https://docs.nestjs.com/graphql/resolvers-map)
   * classes, i.e. using the Nest `\@Resolver()` decorator etc.
   */
  resolvers: Array<Type<any>> | (() => Array<Type<any>>);
}

/**
 * @description
 * This method is called before the app bootstraps and should be used to perform any needed modifications to the {@link VendureConfig}.
 *
 * @docsCategory plugin
 * @docsPage VendurePluginMetadata
 */
export type PluginConfigurationFn = (
  config: RuntimePickerConfig,
) => RuntimePickerConfig | Promise<RuntimePickerConfig>;

/**
 * @description
 * The PickerPlugin decorator is a means of configuring and/or extending the functionality of the Vendure server. A Vendure plugin is
 * a [Nestjs Module](https://docs.nestjs.com/modules), with optional additional metadata defining things like extensions to the GraphQL API, custom
 * configuration or new database entities.
 *
 * As well as configuring the app, a plugin may also extend the GraphQL schema by extending existing types or adding
 * entirely new types. Database entities and resolvers can also be defined to handle the extended GraphQL types.
 *
 * @example
 * ```TypeScript
 * import { Controller, Get } from '\@nestjs/common';
 * import { Ctx, PluginCommonModule, ProductService, RequestContext, VendurePlugin } from '\@vendure/core';
 *
 * \@Controller('products')
 * export class ProductsController {
 *     constructor(private productService: ProductService) {}
 *
 *     \@Get()
 *     findAll(\@Ctx() ctx: RequestContext) {
 *         return this.productService.findAll(ctx);
 *     }
 * }
 *
 *
 * //A simple plugin which adds a REST endpoint for querying products.
 * \@VendurePlugin({
 *     imports: [PluginCommonModule],
 *     controllers: [ProductsController],
 * })
 * export class RestPlugin {}
 * ```
 *
 * @docsCategory plugin
 */
export function PickerPlugin(pluginMetadata: PickerPluginMetadata): ClassDecorator {
  // tslint:disable-next-line:ban-types
  return (target: Function) => {
    for (const metadataProperty of Object.values(PLUGIN_METADATA)) {
      const property = metadataProperty as keyof PickerPluginMetadata;
      if (pluginMetadata[property] != null) {
        Reflect.defineMetadata(property, pluginMetadata[property], target);
      }
    }
    const nestModuleMetadata = pick(pluginMetadata, Object.values(METADATA) as any);
    Module(nestModuleMetadata)(target);
  };
}

/**
 * @description
 * 实现此接口的插件可以定义在Picker服务器初始化时运行的逻辑。
 *
 * 例如，这可以用来调用外部API或设置{@link EventBus}监听器。
 *
 * @docsCategory plugin
 * @docsPage Plugin Lifecycle Methods
 */
export interface OnPickerBootstrap {
  onPickerBootstrap(): void | Promise<void>;
}

/**
 * @description
 * 实现此接口的插件可以定义在初始化Picker worker时运行的逻辑。
 * 例如，这可以用来启动或连接到 Worker 中使用的服务器或数据库。
 *
 * @docsCategory plugin
 * @docsPage Plugin Lifecycle Methods 插件生命周期方法
 */
export interface OnPickerWorkerBootstrap {
  onPickerWorkerBootstrap(): void | Promise<void>;
}

/**
 * @description
 * 实现此接口的插件可以定义在 Picker 服务器关闭之前运行的逻辑。
 *
 例如，这可以用来清理{@link OnPickerBootstrap}方法启动的任何进程。
 *
 * @docsCategory plugin
 * @docsPage Plugin Lifecycle Methods
 */
export interface OnPickerClose {
  onPickerClose(): void | Promise<void>;
}

/**
 * @description
 * 实现这个接口的插件可以定义逻辑，在 Picker 工人关闭之前运行。
 *
 * 例如，这可以用来关闭任何打开的外部服务连接。
 *
 * @docsCategory plugin
 * @docsPage Plugin Lifecycle Methods
 */
export interface OnPickerWorkerClose {
  onPickerWorkerClose(): void | Promise<void>;
}

export type PluginLifecycleMethods = OnPickerBootstrap &
  OnPickerWorkerBootstrap &
  OnPickerClose &
  OnPickerWorkerClose;

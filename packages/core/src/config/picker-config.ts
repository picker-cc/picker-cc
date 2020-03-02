import {DynamicModule, Type} from '@nestjs/common';
import {Transport} from '@nestjs/common/enums/transport.enum';
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';
import {ClientOptions} from '@nestjs/common/interfaces/microservices/client-metadata.interface';
import {RequestHandler} from 'express';
import {ConnectionOptions, Options} from 'mikro-orm';

import {AssetNamingStrategy} from './asset-naming-strategy/asset-naming-strategy';
import {AssetPreviewStrategy} from './asset-preview-strategy/asset-preview-strategy';
import {AssetStorageStrategy} from './asset-storage-strategy/asset-storage-strategy';
import {PickerLogger} from './logger/picker-logger';
import {PluginDefinition} from 'apollo-server-core';

export interface AuthOptions {
  /**
   * @description
   * 禁用身份验证和权限检查。
   * 不要在生产中设置为真
   * 仅为协助开发使用
   *
   * @default false
   */
  disableAuth?: boolean;

  /**
   * @description
   * 默认使用 bearer，未来可以根据需求添加其他 token 方法，如 cookie
   * “authTokenHeaderKey”在服务器的CORS配置中(添加 Control-Expose-Headers: :picker-auth-token”)
   * @default 'bearer'
   */
  tokenMethod: 'cookie' | 'bearer';
  /**
   * 设置header属性，该属性将在使用'bearer'方法时用于发送验证令牌。
   * @default 'picker-auth-token'
   */
  authTokenHeaderKey?: string;
  /**
   * @description
   * Session duration, i.e. the time which must elapse from the last authenticted request
   * after which the user must re-authenticate.
   *
   * Expressed as a string describing a time span per
   * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
   *
   * @default '7d'
   */
  sessionDuration?: string | number;
  /**
   * @description
   * 确定新用户帐户是否需要验证他们的电子邮件地址。
   * 如果设置为 true， 则在登录再次验证时抛出错误
   *
   * @default true
   */
  requireVerification?: boolean;
  /**
   * @description
   * Sets the length of time that a verification token is valid for, after which the verification token must be refreshed.
   *
   * Expressed as a string describing a time span per
   * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
   *
   * @default '7d'
   */
  verificationTokenDuration?: string | number;
}

/**
 * @description
 * The AssetOptions define how assets (images and other files) are named and stored, and how preview images are generated.
 *
 * **Note**: If you are using the `AssetServerPlugin`, it is not necessary to configure these options.
 *
 * @docsCategory assets
 * */
export interface AssetOptions {
  /**
   * @description
   * Defines how asset files and preview images are named before being saved.
   *
   * @default DefaultAssetNamingStrategy
   */
  assetNamingStrategy: AssetNamingStrategy;
  /**
   * @description
   * Defines the strategy used for storing uploaded binary files.
   *
   * @default NoAssetStorageStrategy
   */
  assetStorageStrategy: AssetStorageStrategy;
  /**
   * @description
   * Defines the strategy used for creating preview images of uploaded assets.
   *
   * @default NoAssetPreviewStrategy
   */
  assetPreviewStrategy: AssetPreviewStrategy;
  /**
   * @description
   * The max file size in bytes for uploaded assets.
   *
   * @default 20971520
   */
  uploadMaxFileSize?: number;
}


/**
 * @description
 * Options related to the Picker Worker.
 *
 * @example
 * ```TypeScript
 * import { Transport } from '\@nestjs/microservices';
 *
 * const config: PickerConfig = {
 *     // ...
 *     workerOptions: {
 *         // 传输协议
 *         transport: Transport.TCP,
 *         options: {
 *             host: 'localhost',
 *             port: 3001,
 *         },
 *     },
 * }
 * ```
 *
 * @docsCategory worker
 */
export interface WorkerOptions {
  /**
   * @description
   * If set to `true`, the Worker will run be bootstrapped as part of the main Picker server (when invoking the
   * `bootstrap()` function) and will run in the same process. This mode is intended only for development and
   * testing purposes, not for production, since running the Worker in the main process negates the benefits
   * of having long-running or expensive tasks run in the background.
   *
   * @default false
   */
  runInMainProcess?: boolean;
  /**
   * @description
   * Sets the transport protocol used to communicate with the Worker. Options include TCP, Redis, gPRC and more. See the
   * [NestJS microservices documentation](https://docs.nestjs.com/microservices/basics) for a full list.
   *
   * @default Transport.TCP
   */
  transport?: Transport;
  /**
   * @description
   * Additional options related to the chosen transport method. See See the
   * [NestJS microservices documentation](https://docs.nestjs.com/microservices/basics) for details on the options relating to each of the
   * transport methods.
   *
   * By default, the options for the TCP transport will run with the following settings:
   * * host: 'localhost'
   * * port: 3020
   */
  options?: ClientOptions['options'];
}

export interface PickerConfig {
  /**
   * @description
   * The path to the admin GraphQL API.
   *
   * @default 'admin-api'
   */
  adminApiPath?: string;

  /**
   * @description
   * The path to the admin GraphQL API.
   *
   * @default 'sns-api'
   */
  snsApiPath?: string

  /**
   * @description
   * 处理资产的配置
   */
  assetOptions?: AssetOptions;

  /**
   * @description
   *
   * 权限 配置
   */
  authOptions: AuthOptions;

  /**
   * @description
   * Set the CORS handling for the server. See the [express CORS docs](https://github.com/expressjs/cors#configuration-options).
   *
   * @default { origin: true, credentials: true }
   */
  cors?: boolean | CorsOptions;

  /**
   * @description
   * The connection options used by MikroORM to connect to the database.
   */
  dbConnectionOptions: Options;
  /**
   * @description
   * Defines the strategy used for both storing the primary keys of entities
   * in the database, and the encoding & decoding of those ids when exposing
   * entities via the API. The default uses a simple auto-increment integer
   * strategy.
   *
   * @default new AutoIncrementIdStrategy()
   */
  // entityIdStrategy?: EntityIdStrategy<any>;
  /**
   * @description
   * 设置主机名，默认为 localhost
   *
   * @default ''
   */
  hostname?: string;

  middleware?: Array<{ handler: RequestHandler; route: string }>;

  /**
   * @description
   * An array of plugins.
   *
   * @default []
   */
  plugins?: Array<DynamicModule | Type<any>>;

  /**
   * @description
   * Custom [ApolloServerPlugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins/) which
   * allow the extension of the Apollo Server, which is the underlying GraphQL server used by Picker.
   *
   * Apollo plugins can be used e.g. to perform custom data transformations on incoming operations or outgoing
   * data.
   *
   * @default []
   */
  apolloServerPlugins?: PluginDefinition[];

  /**
   * @description
   * 指定 Picker server 监听端口
   *
   * @default 3000
   */
  port: number;

  /**
   * @description
   * 提供一个 {@link PickerLogger} 的接口实现类
   *
   * @default DefaultLogger
   */
  logger?: PickerLogger;

  /**
   * @description
   * Configures the Picker Worker, which is used for long-running background tasks.
   */
  workerOptions?: WorkerOptions;
}


/**
 * @description
 * 该接口表示在运行时可用的 PickerConfig 对象，即用户提供的对象
 * 配置值已经与{@link defaultConfig}值合并。
 *
 * @docsCategory configuration
 * @docsPage Configuration
 */
export interface RuntimePickerConfig extends Required<PickerConfig> {
  assetOptions: Required<AssetOptions>;
  // customFields: Required<CustomFields>;
  authOptions: Required<AuthOptions>;
}

type DeepPartialSimple<T> = {
  [P in keyof T]?:
  | null
  | (T[P] extends Array<infer U>
  ? Array<DeepPartialSimple<U>>
  : T[P] extends ReadonlyArray<infer X>
    ? ReadonlyArray<DeepPartialSimple<X>>
    : T[P] extends Type<any>
      ? T[P]
      : DeepPartialSimple<T[P]>);
};

export type PartialPickerConfig = DeepPartialSimple<PickerConfig>;

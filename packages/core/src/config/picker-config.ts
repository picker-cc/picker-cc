import {DynamicModule, Type} from '@nestjs/common';
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';
import {RequestHandler} from 'express';
import {ConnectionOptions, Options} from 'mikro-orm';

import {PickerLogger} from './logger/picker-logger';
// import {EntityIdStrategy} from './entity-id-strategy/entity-id-strategy';

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
  tokenMethod?: 'bearer';
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
  // assetOptions: Required<AssetOptions>;
  // customFields: Required<CustomFields>;
  authOptions: Required<AuthOptions>;
}

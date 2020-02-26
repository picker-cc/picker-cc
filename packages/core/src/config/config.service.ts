import {DynamicModule, Injectable, Type} from '@nestjs/common';
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';
import {RequestHandler} from 'express';
import {Options} from 'mikro-orm';

// import {EntityIdStrategy} from '../../../../devhub/apps/web/src/modules/config/entity-id-strategy/entity-id-strategy';

import {getConfig} from './config-helper';
// import {EntityIdStrategy} from './entity-id-strategy/entity-id-strategy';
import {Logger, PickerLogger} from './logger/picker-logger';
import {AuthOptions, PickerConfig, RuntimePickerConfig} from './picker-config';

/**
 * 配置服务，一个工厂模式方便应用系统的全局配置
 */
@Injectable()
export class ConfigService implements PickerConfig {
  private activeConfig: RuntimePickerConfig;

  constructor() {
    this.activeConfig = getConfig();
    if (this.activeConfig.authOptions.disableAuth) {
      // tslint:disable-next-line
      Logger.warn('Auth has been disabled. This should never be the case for a production system!');
    }
  }

  get authOptions(): Required<AuthOptions> {
    return this.activeConfig.authOptions;
  }

  get adminApiPath(): string {
    return this.activeConfig.adminApiPath;
  }

  get snsApiPath(): string {
    return this.activeConfig.snsApiPath;
  }

  get port(): number {
    return this.activeConfig.port;
  }

  get cors(): boolean | CorsOptions {
    return this.activeConfig.cors;
  }

  // get entityIdStrategy(): EntityIdStrategy {
  //   return this.activeConfig.entityIdStrategy;
  // }

  get dbConnectionOptions(): Options {
    return this.activeConfig.dbConnectionOptions;
  }


  get middleware(): Array<{ handler: RequestHandler; route: string }> {
    return this.activeConfig.middleware;
  }

  get plugins(): Array<DynamicModule | Type<any>> {
    return this.activeConfig.plugins;
  }

  get logger(): PickerLogger {
    return this.activeConfig.logger;
  }
}

import { DynamicModule, Injectable, Type } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';

import { getConfig } from './config-helpers';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { Logger, PickerLogger } from './logger/picker-logger';
import {
    ApiOptions,
    AssetOptions,
    PickerConfig,
    RuntimePickerConfig,
} from './picker-config';
import {CustomFields} from "@picker-cc/common/lib/shared-types";
import {GraphQLSchema} from "graphql";

/**
 * 配置服务，一个工厂模式方便应用系统的全局配置
 */
@Injectable()
export class ConfigService implements PickerConfig {
    private activeConfig: RuntimePickerConfig;

    constructor() {
        this.activeConfig = getConfig();
        // console.log('配置服务开启。。。。')
        // if (this.activeConfig.authOptions.disableAuth) {
            // tslint:disable-next-line
            // Logger.warn('Auth 已被禁用，在生产系统中不应该出现这种情况!');
        // }
    }

    // async getAuthConfig() {
    //     return new Promise<{model: string; policy?: string}>((resolve, reject) => {
    //         setTimeout(() => {
    //             return resolve({
    //                 model: 'aodel.conf',
    //                 policy: 'policy.csv'
    //             })
    //         }, 200)
    //     })
    // }
    get schemaConfig() {
        return this.activeConfig.schemaConfig
    }
    get context() {
        return this.activeConfig.context
    }
    get graphqlSchema(): GraphQLSchema {
        return this.activeConfig.graphqlSchema
    }
    get apiOptions(): Required<ApiOptions> {
        return this.activeConfig.apiOptions;
    }


    get port(): number {
        return this.activeConfig.apiOptions.port;
    }

    get cors(): boolean | CorsOptions {
        return this.activeConfig.apiOptions.cors;
    }

    get assetOptions(): AssetOptions {
        return this.activeConfig.assetOptions;
    }

    get plugins(): Array<DynamicModule | Type<any>> {
        return this.activeConfig.plugins;
    }

    get logger(): PickerLogger {
        return this.activeConfig.logger;
    }
}

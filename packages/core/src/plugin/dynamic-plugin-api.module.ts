import { Type } from '@picker-cc/common/lib/shared-types';
import { notNullOrUndefined } from '@picker-cc/common/lib/shared-utils';
import { DynamicModule } from '@nestjs/common';
import { getConfig } from '../config/config-helpers';

import { getModuleMetadata, graphQLResolversFor, isDynamicModule } from './plugin-metadata';

const dynamicApiModuleClassMap: { [name: string]: Type<any> } = {};

/**
 * 这个函数动态地创建一个Nest模块来存放任何已配置插件定义的GraphQL解析器。
 */
export function createDynamicGraphQlModulesForPlugins(): DynamicModule[] {
    return getConfig()
        .plugins.map(plugin => {
            const pluginModule = isDynamicModule(plugin) ? plugin.module : plugin;
            const resolvers = graphQLResolversFor(plugin) || [];
            if (resolvers.length) {
                const className = dynamicClassName(pluginModule);
                dynamicApiModuleClassMap[className] = class {};
                Object.defineProperty(dynamicApiModuleClassMap[className], 'name', { value: className });
                const { imports } = getModuleMetadata(pluginModule);
                return {
                    module: dynamicApiModuleClassMap[className],
                    imports: [pluginModule, ...imports],
                    providers: [...resolvers],
                };
            }
        })
        .filter(notNullOrUndefined) as DynamicModule[];
}

/**
 * 这个函数检索使用createDynamicGraphQlModulesForPlugins创建的任何动态模块。
 */
export function getDynamicGraphQlModulesForPlugins(): Array<any>{
    return getConfig()
        .plugins.map(plugin => {
            const pluginModule = isDynamicModule(plugin) ? plugin.module : plugin;
            const resolvers = graphQLResolversFor(plugin) || [];

            const className = dynamicClassName(pluginModule);
            // const dynamicApiModule = dynamicApiModuleClassMap[className];
            return dynamicApiModuleClassMap[className];
        })
        .filter(notNullOrUndefined);
}

function dynamicClassName(module: Type<any>): string {
    return module.name + `DynamicModule`;
}

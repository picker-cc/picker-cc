import { DynamicModule } from '@nestjs/common';
import { METADATA } from '@nestjs/common/constants';
import { Type } from '@picker-cc/common/lib/shared-types';

import { notNullOrUndefined } from '../../../common/lib/shared-utils';

import { APIExtensionDefinition, PluginConfigurationFn, PluginLifecycleMethods } from './picker-plugin';

export const PLUGIN_METADATA = {
    CONFIGURATION: 'configuration',
    SHOP_API_EXTENSIONS: 'snsApiExtensions',
    ADMIN_API_EXTENSIONS: 'adminApiExtensions',
    WORKERS: 'workers',
    ENTITIES: 'entities',
};

export function getEntitiesFromPlugins(plugins?: Array<Type<any> | DynamicModule>): Array<Type<any>> {
    if (!plugins) {
        return [];
    }
    return plugins
        .map(p => reflectMetadata(p, PLUGIN_METADATA.ENTITIES))
        .reduce((all, entities) => [...all, ...(entities || [])], []);
}

export function getModuleMetadata(module: Type<any>) {
    return {
        controllers: Reflect.getMetadata(METADATA.CONTROLLERS, module) || [],
        providers: Reflect.getMetadata(METADATA.PROVIDERS, module) || [],
        imports: Reflect.getMetadata(METADATA.IMPORTS, module) || [],
        exports: Reflect.getMetadata(METADATA.EXPORTS, module) || [],
    };
}

export function getPluginAPIExtensions(
    plugins: Array<Type<any> | DynamicModule>,
    apiType: 'sns' | 'admin',
): APIExtensionDefinition[] {
    const extensions =
        apiType === 'sns'
            ? plugins.map(p => reflectMetadata(p, PLUGIN_METADATA.SHOP_API_EXTENSIONS))
            : plugins.map(p => reflectMetadata(p, PLUGIN_METADATA.ADMIN_API_EXTENSIONS));

    return extensions.filter(notNullOrUndefined);
}

export function getPluginModules(plugins: Array<Type<any> | DynamicModule>): Array<Type<any>> {
    return plugins.map(p => (isDynamicModule(p) ? p.module : p));
}

export function hasLifecycleMethod<M extends keyof PluginLifecycleMethods>(
    plugin: any,
    lifecycleMethod: M,
): plugin is { [key in M]: PluginLifecycleMethods[M] } {
    return typeof (plugin as any)[lifecycleMethod] === 'function';
}

export function getWorkerControllers(plugin: Type<any> | DynamicModule) {
    return reflectMetadata(plugin, PLUGIN_METADATA.WORKERS);
}

export function getConfigurationFunction(
    plugin: Type<any> | DynamicModule,
): PluginConfigurationFn | undefined {
    return reflectMetadata(plugin, PLUGIN_METADATA.CONFIGURATION);
}

export function graphQLResolversFor(
    plugin: Type<any> | DynamicModule,
    apiType: 'sns' | 'admin',
): Array<Type<any>> {
    const apiExtensions: APIExtensionDefinition =
        apiType === 'sns'
            ? reflectMetadata(plugin, PLUGIN_METADATA.SHOP_API_EXTENSIONS)
            : reflectMetadata(plugin, PLUGIN_METADATA.ADMIN_API_EXTENSIONS);

    return apiExtensions
        ? typeof apiExtensions.resolvers === 'function'
            ? apiExtensions.resolvers()
            : apiExtensions.resolvers
        : [];
}

function reflectMetadata(metatype: Type<any> | DynamicModule, metadataKey: string) {
    if (isDynamicModule(metatype)) {
        return Reflect.getMetadata(metadataKey, metatype.module);
    } else {
        return Reflect.getMetadata(metadataKey, metatype);
    }
}

export function isDynamicModule(input: Type<any> | DynamicModule): input is DynamicModule {
    return !!(input as DynamicModule).module;
}

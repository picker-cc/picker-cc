import {RuntimePickerConfig} from './picker-config';
import {DefaultLogger} from "./logger/default-logger";
import {ObjectIdStrategy} from "./entity-id-strategy/object-id-strategy";
import {DefaultAssetNamingStrategy} from "./asset-naming-strategy/default-asset-naming-strategy";
import {NoAssetStorageStrategy} from "./asset-storage-strategy/no-asset-storage-strategy";
import {NoAssetPreviewStrategy} from "./asset-preview-strategy/no-asset-preview-strategy";
// import {InMemorySessionCacheStrategy} from "./session-cache/in-memory-session-cache-strategy";

export const defaultConfig: RuntimePickerConfig = {
    context: undefined, graphqlSchema: undefined, schemaConfig: undefined,
    logger: new DefaultLogger(),
    apiOptions: {
        hostname: '',
        port: 3000,
        appApiPath: 'api',
        appApiPlayground: true,
        appApiDebug: true,
        cors: {
            origin: true,
            credentials: true
        },
        middleware: [],
        apolloServerPlugins: [],
        introspection: true
    },
    assetOptions: {
        assetNamingStrategy: new DefaultAssetNamingStrategy(),
        assetStorageStrategy: new NoAssetStorageStrategy(),
        assetPreviewStrategy: new NoAssetPreviewStrategy(),
        permittedFileTypes: ['image/*', 'video/*', 'audio/*', '.pdf'],
        uploadMaxFileSize: 20971520,
    },
    plugins: []
};

import {Transport} from '@nestjs/microservices';
import {DEFAULT_AUTH_TOKEN_HEADER_KEY} from '@picker-cc/common/lib/shared-constants';

import {DefaultAssetNamingStrategy} from './asset-naming-strategy/default-asset-naming-strategy';
import {NoAssetPreviewStrategy} from './asset-preview-strategy/no-asset-preview-strategy';
import {NoAssetStorageStrategy} from './asset-storage-strategy/no-asset-storage-strategy';
import {DefaultLogger} from './logger/default-logger';
import {Logger} from './logger/picker-logger';
import {RuntimePickerConfig} from './picker-config';

const logger = new Logger();

export const defaultConfig: RuntimePickerConfig = {
  adminApiPath: 'admin-api',
  // entityIdStrategy: new EntityIdStrategy()
  authOptions: {
    disableAuth: false,
    tokenMethod: 'bearer',
    authTokenHeaderKey: DEFAULT_AUTH_TOKEN_HEADER_KEY,
    requireVerification: false,
    verificationTokenDuration: '7d',
    sessionDuration: '7d',
  },
  assetOptions: {
    assetNamingStrategy: new DefaultAssetNamingStrategy(),
    assetStorageStrategy: new NoAssetStorageStrategy(),
    assetPreviewStrategy: new NoAssetPreviewStrategy(),
    uploadMaxFileSize: 20971520,
  },
  workerOptions: {
    runInMainProcess: false,
    transport: Transport.TCP,
    options: {
      port: 3020,
    },
  },
  snsApiPath: '',
  dbConnectionOptions: {
    dbName: 'picker-cc',
    discovery: {
      warnWhenNoEntities: false, // by default, discovery throws when no entity is processed
      requireEntitiesArray: false, // force usage of `entities` instead of `entitiesDirs`
      alwaysAnalyseProperties: false, // do not analyse properties when not needed (with ts-morph)

      // you can explicitly specify the path to your tsconfig.json (used only when `entitiesDirsTs` is not provided)
      // tsConfigPath: string,
    },
    debug: true,
    logger: logger.log.bind(logger),
  },
  plugins: [],
  hostname: '',
  port: 3000,
  cors: {
    origin: true,
    credentials: true,
  },
  logger: new DefaultLogger(),
  middleware: [],
  apolloServerPlugins: [],
};

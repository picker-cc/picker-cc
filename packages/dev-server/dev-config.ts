import {AssetServerPlugin} from '@picker-cc/asset-server-plugin';
import {ADMIN_API_PATH, API_PORT, SNS_API_PATH} from '@picker-cc/common/lib/shared-constants';
import {
  DefaultLogger,
  LogLevel,
  PickerConfig
} from '@picker-cc/core';
import {ConnectionOptions} from 'mikro-orm';
import path from 'path';
import {AdminUiPlugin} from '@picker-cc/admin-ui-plugin/src/plugin';

export const devConfig: PickerConfig = {
  dbConnectionOptions: {
    // entitiesDirsTs: ['dist'],
    ...getDbConfig(),
  },
  authOptions: {
    disableAuth: false,
    requireVerification: true,
    tokenMethod: 'bearer'
  },
  port: API_PORT,
  adminApiPath: ADMIN_API_PATH,
  snsApiPath: SNS_API_PATH,
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, 'assets'),
      port: 5002,
    }),
    // AdminUiPlugin.init({
    //   port: 5001,
    // }),
  ],
};

function getDbConfig(): ConnectionOptions {
  const dbType = 'mongo';
  return {
    dbName: 'picker-cc',
  };
}

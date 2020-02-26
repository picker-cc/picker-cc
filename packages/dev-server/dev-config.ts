import {ADMIN_API_PATH, API_PORT, SNS_API_PATH} from '@picker-cc/common/lib/shared-constants';
import {
  DefaultLogger,
  LogLevel,
  PickerConfig
} from '@picker-cc/core';
import {ConnectionOptions} from 'mikro-orm';
import path from 'path';

export const devConfig: PickerConfig = {
  dbConnectionOptions: {
    entitiesDirsTs: ['dist'],
    ...getDbConfig()
  },
  authOptions: {
    disableAuth: false,
    requireVerification: true,
  },
  port: API_PORT,
  adminApiPath: ADMIN_API_PATH,
  snsApiPath: SNS_API_PATH
};

function getDbConfig(): ConnectionOptions {
  const dbType = 'mongo';
  return {
    dbName: 'picker-cc'
  };
}

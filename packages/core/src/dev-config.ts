import {ADMIN_API_PATH, API_PORT, SNS_API_PATH} from '@picker-cc/common/lib/shared-constants';
import {
  DefaultLogger,
  LogLevel,
  PickerConfig
} from '@picker-cc/core';
import {ConnectionOptions} from 'mikro-orm';
import {AssetServerPlugin} from '@picker-cc/asset-server-plugin';
import path from 'path';

export const devConfig: PickerConfig = {
  dbConnectionOptions: {
    ...getDbConfig()
  },
  authOptions: {
    disableAuth: false,
    // 无需邮件验证
    requireVerification: false,
  },
  port: API_PORT,
  adminApiPath: ADMIN_API_PATH,
  snsApiPath: SNS_API_PATH,
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, 'assets'),
      port: 5002,
    })
  ]
};

function getDbConfig(): ConnectionOptions {
  const dbType = 'mongo';
  return {
    dbName: 'picker-cc'
  };
}

/*

function getDbConfig(): ConnectionOptions {
  const dbType = process.env.DB || 'mysql';
  switch (dbType) {
    case 'postgres':
      console.log('Using postgres connection');
      return {
        synchronize: true,
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgres',
        password: 'Be70',
        database: 'vendure',
      };
    case 'sqlite':
      console.log('Using sqlite connection');
      return {
        synchronize: false,
        type: 'sqlite',
        database: path.join(__dirname, 'vendure.sqlite'),
      };
    case 'sqljs':
      console.log('Using sql.js connection');
      return {
        type: 'sqljs',
        autoSave: true,
        database: new Uint8Array([]),
        location: path.join(__dirname, 'vendure.sqlite'),
      };
    case 'mysql':
    default:
      console.log('Using mysql connection');
      return {
        synchronize: false,
        type: 'mysql',
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
        database: 'vendure-dev',
      };
  }
}
*/

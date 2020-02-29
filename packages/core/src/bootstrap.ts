import {INestApplication, INestMicroservice, Type} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {TcpClientOptions, Transport} from '@nestjs/microservices';
import {ConnectionOptions} from 'mikro-orm';

import {ReadOnlyRequired} from './common/types/common-types';
import {getConfig, setConfig} from './config/config-helper';
import {DefaultLogger} from './config/logger/default-logger';
import {Logger} from './config/logger/picker-logger';
import {PickerConfig, RuntimePickerConfig} from './config/picker-config';
import {coreEntitiesMap} from './entity/entities';
import {getConfigurationFunction} from './plugin/plugin-metadata';

/**
 * 服务启动引导
 * @param userConfig
 */
export async function bootstrap(userConfig: Partial<PickerConfig>): Promise<INestApplication> {
  const config = await preBootstrapConfig(userConfig);
  Logger.useLogger(config.logger);
  Logger.info(`Bootstrapping Picker Server (pid: ${process.pid})...`);

  // AppModule *必需* 在 entities 全部设置后再加载，这样可以供之后的装配中使用
  const appModule = await import('./app.module');
  DefaultLogger.hideNestBoostrapLogs();
  const app = await NestFactory.create(appModule.AppModule, {
    cors: config.cors,
    logger: new Logger()
  });
  DefaultLogger.restoreOriginalLogLevel();
  app.useLogger(new Logger());
  await app.listen(config.port, config.hostname);
  // 允许使用关闭 Hooks。
  // 如果进程收到关闭信号，将调用提供者的onApplicationShutdown函数
  app.enableShutdownHooks();

  if (config.workerOptions.runInMainProcess) {
    try {
      const worker = await bootstrapWorkerInternal(config);
      Logger.warn(`Worker is running in main process. This is not recommended for production.`);
      Logger.warn(`[PickerConfig.workerOptions.runInMainProcess = true]`);
      closeWorkerOnAppClose(app, worker);
    } catch (e) {
      Logger.error(`Could not start the worker process: ${e.message}`, 'Picker Worker');
    }
  }
  logWelcomeMessage(config);
  return app;
}

export async function bootstrapWorker(userConfig: Partial<PickerConfig>): Promise<INestMicroservice> {
  if (userConfig.workerOptions && userConfig.workerOptions.runInMainProcess === true) {
    Logger.useLogger(userConfig.logger || new DefaultLogger());
    const errorMessage = `Cannot bootstrap worker when "runInMainProcess" is set to true`;
    Logger.error(errorMessage, 'Picker Worker');
    throw new Error(errorMessage);
  } else {
    try {
      const pickerConfig = await preBootstrapConfig(userConfig);
      return await bootstrapWorkerInternal(pickerConfig);
    } catch (e) {
      Logger.error(`Could not start the worker process: ${e.message}`, 'Picker Worker');
      throw e;
    }
  }
}

async function bootstrapWorkerInternal(
  pickerConfig: ReadOnlyRequired<PickerConfig>,
): Promise<INestMicroservice> {
  const config = disableSynchronize(pickerConfig);
  if (!config.workerOptions.runInMainProcess && (config.logger as any).setDefaultContext) {
    (config.logger as any).setDefaultContext('Picker Worker');
  }
  Logger.useLogger(config.logger);
  Logger.info(`Bootstrapping Picker Worker (pid: ${process.pid})...`);

  const workerModule = await import('./worker/worker.module');
  // DefaultLogger.hideNestBoostrapLogs();
  const workerApp = await NestFactory.createMicroservice(workerModule.WorkerModule, {
    transport: config.workerOptions.transport,
    logger: new Logger(),
    options: config.workerOptions.options,
  });
  DefaultLogger.restoreOriginalLogLevel();
  workerApp.useLogger(new Logger());
  workerApp.enableShutdownHooks();

  // A work-around to correctly handle errors when attempting to start the
  // microservice server listening.
  // See https://github.com/nestjs/nest/issues/2777
  // TODO: Remove if & when the above issue is resolved.
  await new Promise((resolve, reject) => {
    (workerApp as any).server.server.on('error', (e: any) => {
      reject(e);
    });
    workerApp.listenAsync().then(resolve);
  });
  workerWelcomeMessage(config);
  return workerApp;
}

export async function preBootstrapConfig(
  userConfig: Partial<PickerConfig>,
): Promise<ReadOnlyRequired<PickerConfig>> {
  if (userConfig) {
    // Logger.info(userConfig.toString());
    // 合并默认配置与自定义配置
    setConfig(userConfig);
  }
  const entities = await getAllEntities(userConfig);
  setConfig({
    dbConnectionOptions: {
      entities,
      // entitiesDirs: ['./**/entity'],
      // entitiesDirsTs: ['./**/entity'],
      discovery: {
        disableDynamicFileAccess: true
      }
    },
  });
  let config = getConfig();
  config = await runPluginConfigurations(config);
  // console.log('获得最终配置')
  // console.log(config);
  setExposedHeaders(config);
  return config;
}

/**
 * 初始化任何已配置的插件
 */
async function runPluginConfigurations(config: RuntimePickerConfig): Promise<RuntimePickerConfig> {
  for (const plugin of config.plugins) {
    const configFn = getConfigurationFunction(plugin);
    if (typeof configFn === 'function') {
      config = await configFn(config);
    }
  }
  return config;
}

/**
 * 返回核心实体数组和插件中定义的任何附加实体。
 * @param userConfig
 */
export async function getAllEntities(userConfig: Partial<PickerConfig>): Promise<Array<Type<any>>> {
  const coreEntities = Object.values(coreEntitiesMap) as Array<Type<any>>;
  // const pluginEntities =
  const allEntities: Array<Type<any>> = coreEntities;
  // 检查，以确保没有插件定义实体的名称
  // 与现有实体冲突的。
  // for (const pluginEntity of pluginEntities) {
  //   if (allEntities.find(e => e.name === pluginEntity.name)) {
  //     throw new InternalServerError(`error.entity-name-conflict`, { entityName: pluginEntity.name });
  //   } else {
  //     allEntities.push(pluginEntity);
  //   }
  // }
  return allEntities;
}

/**
 * 如果使用了'bearer' tokenMethod，那么将自动公开authTokenHeaderKey头
 * 在CORS选项中，确保保留任何用户配置 exposedHeaders。
 * @param config
 */
function setExposedHeaders(config: ReadOnlyRequired<PickerConfig>) {
  if (config.authOptions.tokenMethod === 'bearer') {
    const authTokenHeaderKey = config.authOptions.authTokenHeaderKey as string;
    const corsOptions = config.cors;
    if (typeof corsOptions !== 'boolean') {
      const {exposedHeaders} = corsOptions;
      let exposedHeadersWithAuthKey: string[];
      if (!exposedHeaders) {
        exposedHeadersWithAuthKey = [ authTokenHeaderKey ];
      } else if (typeof exposedHeaders === 'string') {
        exposedHeadersWithAuthKey = exposedHeaders
          .split(',')
          .map(x => x.trim())
          .concat(authTokenHeaderKey);
      } else {
        exposedHeadersWithAuthKey = exposedHeaders.concat(authTokenHeaderKey);
      }
      corsOptions.exposedHeaders = exposedHeadersWithAuthKey;
    }
  }
}

/**
 * Monkey-patches the app's .close() method to also close the worker microservice
 * instance too.
 */
function closeWorkerOnAppClose(app: INestApplication, worker: INestMicroservice) {
  // A Nest app is a nested Proxy. By getting the prototype we are
  // able to access and override the actual close() method.
  const appPrototype = Object.getPrototypeOf(app);
  const appClose = appPrototype.close.bind(app);
  appPrototype.close = async () => {
    await worker.close();
    await appClose();
  };
}

function workerWelcomeMessage(config: PickerConfig) {
  let transportString = '';
  let connectionString = '';
  const transport = (config.workerOptions && config.workerOptions.transport) || Transport.TCP;
  transportString = ` with ${Transport[transport]} transport`;
  const options = (config.workerOptions as TcpClientOptions).options;
  if (options) {
    const {host, port} = options;
    connectionString = ` at ${host || 'localhost'}:${port}`;
  }
  Logger.info(`Picker Worker started${transportString}${connectionString}`);
}

function logWelcomeMessage(config: PickerConfig) {
  let version: string;
  try {
    version = require('../package.json').version;
  } catch (e) {
    version = ' unknown';
  }

  Logger.info(`=================================================`);
  Logger.info(`Picker server (v${version}) now running on port ${config.port}`);
  Logger.info(`Sns API: http://localhost:${config.port}/${config.snsApiPath}`);
  // Logger.info(`Admin API: http://localhost:${config.port}/${config.adminApiPath}`);
  Logger.info(`=================================================`);
}

/**
 * Fix race condition when modifying DB
 * 修正修改数据库时的竞态条件
 */
function disableSynchronize(userConfig: ReadOnlyRequired<PickerConfig>): ReadOnlyRequired<PickerConfig> {
  const config = {...userConfig};
  config.dbConnectionOptions = {
    ...userConfig.dbConnectionOptions,
    // synchronize: false,
  } as ConnectionOptions;
  return config;
}

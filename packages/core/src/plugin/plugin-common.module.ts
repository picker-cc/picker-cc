import {Module} from '@nestjs/common';

import {ConfigModule} from '../config/config.module';
import {EventBusModule} from '../event-bus/event-bus.module';
import {ServiceModule} from '../service/service.module';
import {WorkerServiceModule} from '../worker/worker-service.module';

/**
 * @description
 * 此模块提供公共服务、配置和事件总线功能
 * 需要一个典型的插件。它应该被导入到插件中，以避免不得不这样做
 * 为每个插件重复相同的样板文件。
 * PluginCommonModule导出:
 *
 *  EventBusModule，允许注入{@link EventBus}服务。
 *  ServiceModule允许注入各种实体服务，如 PostService 等。
 *  ConfigModule，允许注入ConfigService。
 *  WorkerServiceModule，允许注入{@link WorkerService}。
 *
 * @docsCategory plugin
 */
@Module({
  imports: [ EventBusModule, ConfigModule, ServiceModule.forPlugin(), WorkerServiceModule ],
  providers: [
    // TODO: Provide an injectable which defines whether in main or worker context
  ],
  exports: [ EventBusModule, ConfigModule, ServiceModule.forPlugin(), WorkerServiceModule ],
})
export class PluginCommonModule {
}

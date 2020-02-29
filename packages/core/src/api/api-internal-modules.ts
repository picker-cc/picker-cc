import {Module} from '@nestjs/common';

import {ConfigModule} from '../config/config.module';
import {ServiceModule} from '../service/service.module';

// import {IdCodecService} from './common/id-codec.service';
import {SnsAuthResolver} from './resolvers/sns/sns-auth.resolver';
import {PostsResolver} from './resolvers/sns/sns-posts.resolver';
import {AssetResolver} from './resolvers/admin/asset.resolver';

// 社区应用的解析器
const snsResolvers = [
  SnsAuthResolver,
  PostsResolver,
  AssetResolver,
];

// 字段解析器
// 我想在 User 类型里再添加一个字段,它的值是用户的 name 小横线,再加上用户的 id 字段的值。在 Resolver 里面可以定义一些 ResolveProperty。 添加一个方法,..
export const entityResolvers = [];
// 管理端应用解析器
export const adminEntityResolvers = [];

@Module({
  imports: [ ConfigModule ],
  // providers: [ IdCodecService ],
  exports: [ ConfigModule ]
})
export class ApiSharedModule {
}

@Module({
  imports: [ ApiSharedModule, ServiceModule.forRoot() ],
  providers: [ ...snsResolvers, ...entityResolvers ],
  exports: [ ...snsResolvers ]
})
export class SnsApiModule {
}

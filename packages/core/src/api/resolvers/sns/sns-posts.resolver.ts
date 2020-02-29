import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {MutationCreatePostArgs, QueryPostsArgs} from '@picker-cc/common/lib/generated-types';
import {PaginatedList} from '@picker-cc/common/lib/shared-types';
import Pageres from 'pageres';

import {Ctx, RequestContext} from '../..';
import {ConfigService} from '../../../config';
import {Post} from '../../../entity';
import {AuthService, UserService} from '../../../service';
import {PostService} from '../../../service/services/post.service';

@Resolver()
export class PostsResolver {
  constructor(
    private postService: PostService,
    private configService: ConfigService,
  ) {
  }

  /**
   * 查询发布的内容列表
   * @param ctx
   * @param args
   */
  @Query()
  async posts(
    @Ctx() ctx: RequestContext,
    @Args() args: QueryPostsArgs,
  ): Promise<PaginatedList<Post>> {
    return this.postService.findAll(ctx, args.options || undefined);
  }

  /**
   * 查询单条发布的内容
   * @param ctx
   * @param args
   */
  @Query()
  async post(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ): Promise<Post | undefined> {
    if (args.id) {
      const post = await this.postService.findOne(ctx, args.id);
      return post;
    }
  }

  @Mutation()
  async createPost(
    @Ctx() ctx: RequestContext,
    @Args() args: MutationCreatePostArgs
  ): Promise<Post> {
    const {input} = args;
    // await new Pageres({delay: 2})
    //   .src('https://www.jianshu.com', ['480x320', '1024x768', 'iphone 5s'], {crop: true})
    //   .src('data:text/html,<h1>Awesome!</h1>', ['1024x768'])
    //   .dest(__dirname + '/screenshot')
    //   .run();

    // console.log('Finished generating screenshots!');
    return await this.postService.create(ctx, input);
  }
}

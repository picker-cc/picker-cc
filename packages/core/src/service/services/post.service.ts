import {Injectable} from '@nestjs/common';
import {CreatePostInput, RegisterCreatorInput} from '@picker-cc/common/lib/generated-types';
import {ID, PaginatedList} from '@picker-cc/common/lib/shared-types';
import {EntityManager, EntityRepository, QueryBuilder} from 'mikro-orm';
// import {InjectRepository} from 'nestjs-mikro-orm';
import slug from 'limax';
import {RequestContext} from '../../api/common/request-context';
import {UserInputError} from '../../common/error/errors';
import {ListQueryOptions} from '../../common/types/common-types';
import {ConfigService} from '../../config/config.service';
import {Post} from '../../entity';
import {ListQueryBuilder} from '../helpers/list-query-builder/list-query-builder';
// import {User} from '../../entity/users/user.entity';
// import {EventBus} from '../../event-bus/event-bus';
// import {PasswordCipher} from '../helpers/PasswordCipher';
// import {VerificationTokenGenerator} from '../helpers/verification-token-generator';

@Injectable()
export class PostService {
  constructor(
    private readonly em: EntityManager,
    private configService: ConfigService,
    private listQueryBuilder: ListQueryBuilder,
    // private passwordCipher: PasswordCipher,
    // private verificationTokenGenerator: VerificationTokenGenerator,
  ) {
  }

  async findOne(ctx: RequestContext, id: ID): Promise<Post> {
    const post = await this.em.findOneOrFail(Post, {
      id
    });
    return post;
  }

  /**
   * 根据ID 查找内容
   * @param id
   */
  async findById(id: string): Promise<Post> {
    const data: Post = await this.em.findOneOrFail(Post, {
      id
    });
    return data;
  }

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Post>,
  ): Promise<PaginatedList<Post>> {
    const query = {
      limit: 10,
      offset: 0
    };
    if (options !== undefined && options !== null) {
      const skip = options.skip;
      let take = options.take;
      if (options.skip !== undefined && options.take === undefined) {
        take = Number.MAX_SAFE_INTEGER;
      }
      if (take !== undefined && take !== null) {
        query.limit = take;
      }
      if (skip !== undefined && skip !== null) {
        query.offset = skip;
      }
    }
    const [ items, totalItems ] = await this.em.findAndCount(
      Post,
      {},
      {
        ...query
      });
    return {
      items,
      totalItems
    };
  }

  async create(ctx: RequestContext, input: CreatePostInput): Promise<Post> {
    const postEntity = new Post(input);
    // return await this.em.persistAndFlush(postEntity);
    // postEntity.slug = slug(postEntity.title);
    postEntity.name = slug(postEntity.title, {separateNumbers: false})
    postEntity.meta.likes = 1
    await this.em.persist(postEntity);
    await this.em.flush();
    console.log(postEntity);
    return postEntity;
    // const article = new Article().assign(dto)
    // const post = new Post()
    // const post = await this.em.create(Post, {title: 'shom....'});
    // return post;
    // return post;
  }

  // async getList(): Promise<>
  async registerCreatorAccount(ctx: RequestContext, input: RegisterCreatorInput): Promise<boolean> {
    if (this.configService.authOptions.requireVerification) {
      if (input.password) {
        throw new UserInputError(`error.unexpected-password-on-registration`);
      }
    } else {
      if (!input.password) {
        throw new UserInputError(`error.missing-password-on-registration`);
      }
    }
    // const user = await this.createCreatorUser(input.emailAddress, input.password || undefined);
    // this.eventBus.publish(new AccountRegistrationEvent(ctx, user));
    return true;
  }
}

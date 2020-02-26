import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {LoginResult, MutationLoginArgs, MutationRegisterCreatorAccountArgs, Permission} from '@picker-cc/common/lib/generated-types';
import {Request, Response} from 'express';

import {ConfigService} from '../../../config';
// import {EventBus} from '../../../event-bus/event-bus';
import {AuthService} from '../../../service/services/auth.service';
import {UserService} from '../../../service/services/user.service';
import {RequestContext} from '../../common/request-context';
import {Allow} from '../../decorators/allow.decorator';
import {Ctx} from '../../decorators/request-context.decorator';
import {BaseAuthResolver} from '../base-auth.resolver';

@Resolver()
export class SnsAuthResolver extends BaseAuthResolver {
  constructor(
    authService: AuthService,
    userService: UserService,
    configService: ConfigService,
    // private eventBus: EventBus,

  ) {
    super(authService, userService, configService);
  }

  @Mutation()
  @Allow(Permission.Public)
  login(
    @Args() args: MutationLoginArgs,
    @Ctx() ctx: RequestContext,
    @Context('req') req: Request,
    @Context('res') res: Response,
  ): Promise<LoginResult> {
    return super.login(args, ctx, req, res, 'sns');
  }

  @Mutation()
  @Allow(Permission.Public)
  logout(
    @Ctx() ctx: RequestContext,
    @Context('req') req: Request,
    @Context('res') res: Response,
  ): Promise<boolean> {
    return super.logout(ctx, req, res);
  }

  @Mutation()
  @Allow(Permission.Public)
  async registerCreatorAccount(
    @Ctx() ctx: RequestContext,
    @Args() args: MutationRegisterCreatorAccountArgs,
  ) {
    console.log('s-s-s-s-s--s-s-s99999')
    console.log('注册用户')
    return this.userService.registerCreatorAccount(ctx, args.input).then(() => true);
  }
}

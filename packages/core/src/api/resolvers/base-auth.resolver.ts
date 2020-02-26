import {CurrentUser, LoginResult, MutationLoginArgs} from '@picker-cc/common/lib/generated-types';
import {Request, Response} from 'express';

import {ConfigService} from '../../config';
import {User} from '../../entity/users/user.entity';
import {AuthService} from '../../service/services/auth.service';
import {UserService} from '../../service/services/user.service';
import {extractAuthToken} from '../common/extract-auth-token';
import {ApiType} from '../common/get-api-type';
import {RequestContext} from '../common/request-context';
import {setAuthToken} from '../common/set-auth-token';

export class BaseAuthResolver {
  constructor(
    protected authService: AuthService,
    protected userService: UserService,
    protected configService: ConfigService
  ) {
  }

  async login(
    args: MutationLoginArgs,
    ctx: RequestContext,
    req: Request,
    res: Response,
    apiType: ApiType,
  ): Promise<LoginResult> {
    return await this.createAuthenticatedSession(ctx, args, req, res, apiType);
  }

  async logout(ctx: RequestContext, req: Request, res: Response): Promise<boolean> {
    const token = extractAuthToken(req, this.configService.authOptions.tokenMethod);
    if (!token) {
      return false;
    }
    await this.authService.deleteSessionByToken(ctx, token);
    setAuthToken({
      req,
      res,
      authOptions: this.configService.authOptions,
      rememberMe: false,
      authToken: '',
    });
    return true;
  }

  /**
   * Creates an authenticated session and sets the session token.
   */
  protected async createAuthenticatedSession(
    ctx: RequestContext,
    args: MutationLoginArgs,
    req: Request,
    res: Response,
    apiType?: ApiType,
  ) {
    const session = await this.authService.authenticate(ctx, args.username, args.password);
    // if (apiType && apiType === 'admin') {
    //   const administrator = await this.administratorService.findOneByUserId(session.user.id);
    //   if (!administrator) {
    //     throw new UnauthorizedError();
    //   }
    // }
    setAuthToken({
      req,
      res,
      authOptions: this.configService.authOptions,
      rememberMe: args.rememberMe || false,
      authToken: session.token,
    });
    return {
      user: {
        id: session.user.id as string,
        identifier: session.user.identifier,
        token: session.token,
        permissions: ['Owner']
      }
      // user: this.publiclyAccessibleUser(session.user),
    };
  }

  /**
   * Exposes a subset of the User properties which we want to expose to the public API.
   */
  private publiclyAccessibleUser(user: User): CurrentUser {
    return {
      id: user.id as string,
      identifier: user.identifier,
    };
  }
}


import {Injectable} from '@nestjs/common';
import {Permission} from '@picker-cc/common/lib/generated-types';
import {Request} from 'express';
import {GraphQLResolveInfo} from 'graphql';

import {ConfigService} from '../../config';
// import {Session as AuthenticatedSession} from '../../entity/session/session.entity';
import {Session} from '../../entity';

import {getApiType} from './get-api-type';
import {RequestContext} from './request-context';

export const REQUEST_CONTEXT_KEY = 'pickerRequestContext';

/**
 * 创建一个新的 RequestContext 实例
 */
@Injectable()
export class RequestContextService {
  constructor(private configService: ConfigService) {
  }

  async fromRequest(
    req: Request,
    info?: GraphQLResolveInfo,
    requiredPermissions?: Permission[],
    session?: Session,
  ): Promise<RequestContext> {
    const apiType = getApiType(info);
    const hasOwnerPermission = !!requiredPermissions && requiredPermissions.includes(Permission.Owner);
    const user = session && session.user;
    const isAuthorized = true;
    const authorizedAsOwnerOnly = hasOwnerPermission;
    const translationFn = (req as any).t;

    return new RequestContext({
      apiType,
      session,
      isAuthorized,
      authorizedAsOwnerOnly
    });
  }
}

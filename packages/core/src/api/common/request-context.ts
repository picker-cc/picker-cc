import {ID} from '@picker-cc/common/lib/shared-types';

// import {AnonymousSession} from '../../entity/session/anonymous-session.entity';
// import {AuthenticatedSession} from '../../entity/session/authenticated-session.entity';
import {Session} from '../../entity/session/session.entity';
import {User} from '../../entity/users/user.entity';

import {ApiType} from './get-api-type';

export class RequestContext {
  private readonly _session?: Session | undefined;
  private readonly _isAuthorized: boolean;
  private readonly _authorizedAsOwnerOnly: boolean;
  private readonly _apiType: ApiType;

  /**
   * @internal
   */
  constructor(options: {
    apiType: ApiType;
    session?: Session;
    isAuthorized: boolean;
    authorizedAsOwnerOnly: boolean;
  }) {
    const {apiType, session,} = options;
    this._apiType = apiType;
    this._session = session;
    this._isAuthorized = options.isAuthorized;
    this._authorizedAsOwnerOnly = options.authorizedAsOwnerOnly;
  }

  static fromObject(ctxObject: any): RequestContext {
    let session: Session | undefined;
    if (ctxObject._session) {
      if (ctxObject._session.user) {
        const user = new User(ctxObject._session.user);
        session = new Session({
          ...ctxObject._session,
          user
        });
      } else {
        session = new Session(ctxObject._session);
      }
    }

    return new RequestContext({
      apiType: ctxObject._apiType,
      session,
      isAuthorized: ctxObject._isAuthorized,
      authorizedAsOwnerOnly: ctxObject._authorizedAsOwnerOnly,
    });
  }

  get apiType(): ApiType {
    return this._apiType;
  }

  get session(): Session | undefined {
    return this._session;
  }

  get activeUserId(): ID | undefined {
    const user = this.activeUser;
    if (user) {
      return user.id;
    }
  }

  get activeUser(): User | undefined {
    if (this.session) {
      if (this.isAuthenticatedSession(this.session)) {
        return this.session.user;
      }
    }
  }

  /**
   * @description
   * True if the current anonymous session is only authorized to operate on entities that
   * are owned by the current session.
   */
  get authorizedAsOwnerOnly(): boolean {
    return this._authorizedAsOwnerOnly;
  }

  /**
   * @description
   * 如果当前会话被授权访问当前解析器方法，则为True。
   */
  get isAuthorized(): boolean {
    return this._isAuthorized;
  }

  private isAuthenticatedSession(session: Session): session is Session {
    return session.hasOwnProperty('user');
  }
}

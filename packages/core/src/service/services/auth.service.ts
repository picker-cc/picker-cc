import {Injectable} from '@nestjs/common';
import crypto from 'crypto';
import {EntityManager} from 'mikro-orm';
import ms from 'ms';

import {RequestContext} from '../../api/common/request-context';
import {NotVerifiedError, UnauthorizedError} from '../../common/error/errors';
import {ConfigService} from '../../config';
import {Session} from '../../entity';
import {User} from '../../entity/users/user.entity';
import {EventBus} from '../../event-bus/event-bus';
import {AttemptedLoginEvent} from '../../event-bus/events/AttemptedLoginEvent';
import {LoginEvent} from '../../event-bus/events/login-event';
import {PasswordCipher} from '../helpers/PasswordCipher';
import {LogoutEvent} from '../../event-bus/events/logout-event';

@Injectable()
export class AuthService {
  private readonly sessionDurationInMs: number;

  constructor(
    private readonly connection: EntityManager,
    private passwordCipher: PasswordCipher,
    private configService: ConfigService,
    private eventBus: EventBus,
  ) {
    this.sessionDurationInMs = ms(this.configService.authOptions.sessionDuration as string);
  }

  /**
   * 验证用户的凭据，如果通过，则创建一个新会话。
   */
  async authenticate(
    ctx: RequestContext,
    identifier: string,
    password: string
  ): Promise<Session> {
    // 尝试登录的事件发起
    this.eventBus.publish(new AttemptedLoginEvent(ctx, identifier));
    const user = await this.getUserFromIdentifier(identifier);
    console.log('查询到的用户数据');
    console.log(user);
    console.log(user.id);
    console.log(user._id);
    await this.verifyUserPassword(user.id, password);
    // 如果需要用户注册必需确认验证信息，则确认
    if (this.configService.authOptions.requireVerification && !user.verified) {
      throw new NotVerifiedError();
    }
    const session = await this.createNewAuthenticatedSession(ctx, user);
    await this.connection.getRepository(Session).persistAndFlush(session);
    // const repo = this.connection.getRepository(AuthenticatedSession);
    this.eventBus.publish(new LoginEvent(ctx, user));
    return session;
  }

  /**
   * 根据给定用户的密码验证所提供的密码。
   * @param userId
   * @param password
   */
  async verifyUserPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.connection.findOne(User, {id: userId}, {fields: [ 'passwordHash' ]});
    if (!user) {
      throw new UnauthorizedError();
    }
    const passwordMatches = await this.passwordCipher.check(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedError();
    }
    return true;
  }

  private async createNewAuthenticatedSession(
    ctx: RequestContext,
    user: User,
  ): Promise<Session> {
    const token = await this.generateSessionToken();
    return new Session({
      token,
      user,
      expires: this.getExpiryDate(this.sessionDurationInMs),
      invalidated: false
    });
  }

  private async getUserFromIdentifier(identifier: string): Promise<User> {
    // const books = await orm.em.find(Book, { foo: 1 }, ['author.friends']);
    console.log('按唯一标识查询用户信息');
    console.log(identifier);
    const user = await this.connection.findOne(User, {
        identifier
      },
      // [ 'roles' ],
    );
    if (!user) {
      throw new UnauthorizedError();
    }
    return user;
  }

  private generateSessionToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buf) => {
        if (err) {
          reject(err);
        }
        resolve(buf.toString('hex'));
      });
    });
  }

  /**
   * Deletes all sessions for the user associated with the given session token.
   */
  async deleteSessionByToken(ctx: RequestContext, token: string): Promise<void> {
    const session = await this.connection.getRepository(Session).findOne({
      token
    });
    if (session) {
      console.log(session);
      console.log(session.user);
      // this.eventBus.publish(new LogoutEvent(ctx));
      return this.deleteSessionsByUser(session.user);
    }
  }

  /**
   * Deletes all existing sessions for the given user.
   */
  async deleteSessionsByUser(user: User): Promise<void> {
    await this.connection.remove(Session, {user});
    await this.connection.flush();
  }

  /**
   * If we are over half way to the current session's expiry date, then we update it.
   *
   * This ensures that the session will not expire when in active use, but prevents us from
   * needing to run an update query on *every* request.
   */
  // private async updateSessionExpiry(session: Session) {
  //   const now = new Date().getTime();
  //   if (session.expires.getTime() - now < this.sessionDurationInMs / 2) {
  //     const findSession = await this.connection
  //       .findOne(Session, {id: session.id});
  //     if (findSession !== null) {
  //       findSession.expires = this.getExpiryDate(this.sessionDurationInMs);
  //       await this.connection.flush();
  //     }
  //   }
  // }
  /**
   * Looks for a valid session with the given token and returns one if found.
   */
  async validateSession(token: string): Promise<Session | undefined> {
    const session = await this.connection.findOne(Session, {token});
    // const session = await this.connection
    //   .getRepository(Session)
    //   .createQueryBuilder('session')
    //   .leftJoinAndSelect('session.activeOrder', 'activeOrder')
    //   .leftJoinAndSelect('session.user', 'user')
    //   .leftJoinAndSelect('user.roles', 'roles')
    //   .leftJoinAndSelect('roles.channels', 'channels')
    //   .where('session.token = :token', { token })
    //   .andWhere('session.invalidated = false')
    //   .getOne();

    if (session && session.expires > new Date()) {
      await this.updateSessionExpiry(session);
      return session;
    }
  }

  /**
   * If we are over half way to the current session's expiry date, then we update it.
   *
   * This ensures that the session will not expire when in active use, but prevents us from
   * needing to run an update query on *every* request.
   */
  private async updateSessionExpiry(session: Session) {
    const now = new Date().getTime();
    // if (session.expires.getTime() - now < this.sessionDurationInMs / 2) {
    //   await this.connection
    //     .getRepository(Session)
    //     .update({ id: session.id }, { expires: this.getExpiryDate(this.sessionDurationInMs) });
    // }
  }

  /**
   * Returns a future expiry date according timeToExpireInMs in the future.
   */
  private getExpiryDate(timeToExpireInMs: number): Date {
    return new Date(Date.now() + timeToExpireInMs);
  }
}

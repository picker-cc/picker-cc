import {Injectable} from '@nestjs/common';
import {RegisterCreatorInput} from '@picker-cc/common/lib/generated-types';
import {EntityManager, EntityRepository} from 'mikro-orm';
import {InjectRepository} from 'nestjs-mikro-orm';

import {RequestContext} from '../../api/common/request-context';
import {UserInputError} from '../../common/error/errors';
import {ConfigService} from '../../config/config.service';
import {User} from '../../entity/users/user.entity';
import {EventBus} from '../../event-bus/event-bus';
import {PasswordCipher} from '../helpers/PasswordCipher';
import {VerificationTokenGenerator} from '../helpers/verification-token-generator';

@Injectable()
export class UserService {
  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: EntityRepository<User>,
    private readonly connection: EntityManager,
    private configService: ConfigService,
    // private userService: UserService,
    // private eventBus: EventBus,
    private passwordCipher: PasswordCipher,
    private verificationTokenGenerator: VerificationTokenGenerator,
  ) {
  }

  async createCreatorUser(identifier: string, password?: string): Promise<User> {
    const user = new User();
    if (this.configService.authOptions.requireVerification) {
      // 发往邮箱的验证码
      user.verificationToken = this.verificationTokenGenerator.generateVerificationToken();
      user.verified = false;
    } else {
      user.verified = true;
    }
    if (password) {
      user.passwordHash = await this.passwordCipher.hash(password);
    } else {
      user.passwordHash = '';
    }

    user.identifier = identifier;
    // const customerRole = await this.roleService.getCustomerRole();
    // user.roles = [customerRole];
    // return this.connection.manager.save(user);
    await this.connection.persistAndFlush(user);
    return user;
  }

  async createAdminUser(identifier: string, password: string): Promise<User> {
    const user = new User({
      passwordHash: await this.passwordCipher.hash(password),
      identifier,
      verified: true,
    });
    await this.connection.persistAndFlush(user);
    return user;
    // return this.connection.manager.save(user);
  }

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
    const user = await this.createCreatorUser(input.emailAddress, input.password || undefined);
    // this.eventBus.publish(new AccountRegistrationEvent(ctx, user));
    return true;
  }
}

import {DeepPartial} from '@picker-cc/common/lib/shared-types';
import {IsEmail, IsMobilePhone} from 'class-validator';
import {Entity, ManyToMany, ManyToOne, MongoEntity, OneToMany, PrimaryKey, Property, SerializedPrimaryKey, Unique} from 'mikro-orm';

import {PickerEntity} from '../base/base.entity';

import {Role} from './role.entity';
import {Post} from '../posts/post.entity';

@Entity()
@Unique({properties: [ 'name', 'email' ]})
export class User extends PickerEntity {
  constructor(input?: DeepPartial<User>) {
    super(input);
  }

  @Property({
    unique: true,
    type: 'string',
  })
  @Unique()
  identifier: string;

  @Property()
  displayName: string;
  @Property()
  passwordHash: string;
  @IsMobilePhone('zh-CN', {message: '手机号错误？'})
  @Property()
  phone?: string;
  @IsEmail({}, {message: '📮邮箱格式错误？'})
  @Property()
  email?: string;
  @Property()
  verified?: boolean;
  @Property()
  verificationToken?: string | null;
  /**
   * @description
   * 用于更新用户标识的令牌,通常是一个邮件地址
   */
  @Property()
  identifierChangeToken?: string | null;
  @Property()
  lastLogin: string;

  @Property()
  @ManyToMany(() => Role)
  roles: Role[];

  @Property()
  @OneToMany(() => User)
  posts: Post[];
}

import {DeepPartial} from '@picker-cc/common/lib/shared-types';
import {IsInt, IsNotEmpty, IsString} from 'class-validator';
import {Entity, ManyToMany, ManyToOne, Property} from 'mikro-orm';

import {PickerEntity} from '../base/base.entity';
import {User} from '../users/user.entity';

export class Meta {
  constructor() {
    this.likes = 0;
    this.views = 0;
  }
  @IsInt()
  @Property({default: 0})
  likes: number;
  @IsInt()
  @Property({default: 0})
  views: number;
}

@Entity()
export class Post extends PickerEntity {
  constructor(input: DeepPartial<Post>) {
    super(input);
  }

  // @Property()
  // @ManyToOne(() => User)
  // author: User;
  @IsNotEmpty({message: '标题?'})
  @IsString({message: '字符串? '})
  @Property({})
  title: string;

  @Property()
  description: string;
  @Property({
    unique: true
  })
  name: string;
  // 唯一地址
  @Property()
  guid: string;
  @IsNotEmpty({message: 'Slug?'})

  @Property()
  content: string;

  @ManyToOne(() => User)
  user: User;

  // 元信息
  @Property({
    type: Meta,
  })
  meta = new Meta();

  related?: Post[];
}

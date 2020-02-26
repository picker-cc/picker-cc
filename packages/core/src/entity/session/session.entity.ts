import {DeepPartial} from '@picker-cc/common/lib/shared-types';
import {Entity, ManyToOne, Property} from 'mikro-orm';

import {PickerEntity} from '../base/base.entity';
import {User} from '../users/user.entity';

@Entity()
export class Session extends PickerEntity {
  constructor(input: DeepPartial<Session>) {
    super(input);
  }

  @Property()
  token: string;
  @Property()
  expires: Date;
  @Property()
  invalidated: boolean;

  @ManyToOne(() => User)
  user: User;
}

import {Permission} from '@picker-cc/common/lib/generated-types';
import {DeepPartial} from '@picker-cc/common/lib/shared-types';
import {Entity, Property} from 'mikro-orm';

import {PickerEntity} from '../base/base.entity';

@Entity()
export class Role extends PickerEntity {
  constructor(input?: DeepPartial<Role>) {
    super(input);
  }

  @Property()
  code: string;
  @Property()
  description: string;
  @Property()
  permissions: Permission[];
}

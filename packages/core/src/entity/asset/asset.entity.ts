import {AssetType} from '@picker-cc/common/lib/generated-types';
import {DeepPartial} from '@picker-cc/common/lib/shared-types';
import {Entity, Property} from 'mikro-orm';

import {PickerEntity} from '../base/base.entity';

@Entity()
export class Asset extends PickerEntity {
  constructor(input?: DeepPartial<Asset>) {
    super(input);
  }

  @Property() name: string;

  @Property() type: AssetType;

  @Property() mimeType: string;

  @Property({default: 0}) width: number;

  @Property({default: 0}) height: number;

  @Property() fileSize: number;

  @Property() source: string;

  @Property() preview: string;

  // @Property('simple-json', { nullable: true })
  @Property()
  focalPoint?: { x: number; y: number };
}

import {DeepPartial} from '@picker-cc/common/lib/shared-types';
import {IsAlphanumeric, IsInt, IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {Entity, ManyToMany, ManyToOne, Property} from 'mikro-orm';

import {PickerEntity} from '../base/base.entity';

@Entity()
export class Category extends PickerEntity {
  constructor(input: DeepPartial<Category>) {
    super(input);
  }

  @IsNotEmpty({message: '标题?'})
  @IsString({message: '字符串? '})
  @Property({})
  name: string;

  @IsNotEmpty({ message: '分类别名？' })
  @IsString({ message: '字符串？' })
  @IsAlphanumeric('en-US', { message: 'slug 只允许字母和数字' })
  @MaxLength(30)
  slug: string;

  @IsString({ message: '字符串？' })
  @Property()
  description: string;

  @Property()
  excerpt: string;
  @Property()
  content: string;
}

import {DeepPartial, ID} from '@picker-cc/common/lib/shared-types';
import {BeforeCreate, MongoEntity, PrimaryKey, Property, SerializedPrimaryKey} from 'mikro-orm';
import {ObjectId} from 'mongodb';
/**
 * @description
 * 所有 entities 继承此类
 * @docsCategory entities
 */
export abstract class PickerEntity implements MongoEntity<PickerEntity> {
  protected constructor(input?: DeepPartial<PickerEntity>) {
    if (input) {
      for (const [ key, value ] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }

  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt = new Date();

  @Property({onUpdate: () => new Date()})
  updatedAt = new Date();
}

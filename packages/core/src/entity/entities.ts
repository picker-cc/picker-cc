import {Asset} from './asset/asset.entity';
import {PickerEntity} from './base/base.entity';
import {Post} from './posts/post.entity';
import {Session} from './session/session.entity';
import {User} from './users/user.entity';

/**
 * A map of all the core database entities.
 */
export const coreEntitiesMap = {
  Asset,
  Post,
  Session,
  User,
  PickerEntity
};

/**
 * 基于 mime type 返回 AssetType。
 */
import {AssetType} from '@picker-cc/common/lib/generated-types';

export function getAssetType(mimeType: string): AssetType {
  const type = mimeType.split('/')[0];
  switch (type) {
    case 'image':
      return AssetType.IMAGE;
    case 'video':
      return AssetType.VIDEO;
    default:
      return AssetType.BINARY;
  }
}

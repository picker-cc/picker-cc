/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 */
import {PickerConfig} from './picker-config';
import {DeepPartial} from '@picker-cc/common/lib/shared-types';

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function isClassInstance(item: any): boolean {
  return isObject(item) && item.constructor.name !== 'Object';
}

/**
 * Deep merge config objects. Based on the solution from https://stackoverflow.com/a/34749873/772859
 * but modified so that it does not overwrite fields of class instances, rather it overwrites
 * the entire instance.
 */
export function mergeConfig<T extends PickerConfig>(target: T, source: DeepPartial<PickerConfig>): T {
  if (!source) {
    return target;
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject((source as any)[key])) {
        if (!(target as any)[key]) {
          Object.assign((target as any), { [key]: {} });
        }
        if (!isClassInstance((source as any)[key])) {
          mergeConfig((target as any)[key], (source as any)[key]);
        } else {
          (target as any)[key] = (source as any)[key];
        }
      } else {
        Object.assign(target, { [key]: (source as any)[key] });
      }
    }
  }
  return target;
}

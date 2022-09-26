/**
 * @file App universal
 * @module universal
 */

import {isClient, isServer} from "../universal/environment";

export * from './context'
export * from './ref'
// export * from './prefetch'

// env only
export const onClient = (callback: any) => {
  isClient && callback()
}

export const onServer = (callback: any) => {
  isServer && callback()
}

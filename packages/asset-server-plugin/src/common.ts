import { REQUEST_CONTEXT_KEY } from '@picker-cc/core/dist/common/constants';
import { Request } from 'express';

import { AssetServerOptions } from './types';

/**
 * 资产请求的URL前缀处理方法
 * @param options
 */
export function getAssetUrlPrefixFn(options: AssetServerOptions) {
    const { assetUrlPrefix, route } = options;
    if (assetUrlPrefix == null) {
        return (request: Request, identifier: string) =>
            `${request.protocol}://${request.get('host')}/${route}/`;
    }
    if (typeof assetUrlPrefix === 'string') {
        return (...args: any[]) => assetUrlPrefix;
    }
    if (typeof assetUrlPrefix === 'function') {
        return (request: Request, identifier: string) => {
            const ctx = (request as any)[REQUEST_CONTEXT_KEY];
            // @ts-ignore
            return assetUrlPrefix(ctx, identifier);
        };
    }
    throw new Error(`The assetUrlPrefix option was of an unexpected type: ${JSON.stringify(assetUrlPrefix)}`);
}

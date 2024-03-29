import { Injectable } from '@nestjs/common';
import { PickerContext } from '../schema/types';

// type ProcessContextType = 'server' | 'worker';
let currentContext: PickerContext;

/**
 * @description
 * ProcessContext 可以被注入到你的 providers & modules，以便知道它是在Picker 主服务器或 worker 的上下文中执行。
 *
 * @example
 * ```TypeScript
 * import { Injectable, OnApplicationBootstrap } from '\@nestjs/common';
 * import { ProcessContext } from '\@picker-cc/core';
 *
 * \@Injectable()
 * export class MyService implements OnApplicationBootstrap {
 *   constructor(private processContext: ProcessContext) {}
 *
 *   onApplicationBootstrap() {
 *     if (this.processContext.isServer) {
 *       // 只在服务器进程中运行的代码
 *     }
 *   }
 * }
 * ```
 *
 * @docsCategory common
 */
export class Picker {
    // get isServer(): boolean {
    //     return currentContext === 'server';
    // }
    // get isWorker(): boolean {
    //     return currentContext === 'worker';
    // }
    get context(): PickerContext {
        return currentContext
        // return {
            // query: currentContext.query
            // ...currentContext
        // }
    }
}

/**
 * @description
 * 应该只在核心引导函数中调用，以建立当前进程上下文。
 * @internal
 */
export function setPickerContext(context: PickerContext) {
    currentContext = context;
}

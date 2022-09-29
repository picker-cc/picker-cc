import { DynamicModule, Provider } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentModuleOptions, ComponentModuleRootOptions } from '../types';
export declare class WeChatComponentModule {
    static register(options: ComponentModuleOptions): DynamicModule;
    static forRootAsync(options: ComponentModuleRootOptions): {
        global: boolean;
        module: typeof WeChatComponentModule;
        imports: (import("@nestjs/common").Type<any> | DynamicModule | Promise<DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
        providers: Provider<any>[];
        exports: (typeof ComponentService)[];
    };
}

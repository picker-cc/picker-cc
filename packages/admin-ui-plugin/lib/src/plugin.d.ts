import { AdminUiExtension, Type } from '@picker-cc/common/lib/shared-types';
import { ConfigService, OnPickerBootstrap, OnPickerClose, RuntimePickerConfig } from '@picker-cc/core';
import { UiAppCompiler } from './ui-app-compiler.service';
export interface AdminUiOptions {
    hostname?: string;
    port: number;
    apiHost?: string | 'auto';
    apiPort?: number | 'auto';
    extensions?: AdminUiExtension[];
    watch?: boolean;
}
export declare class AdminUiPlugin implements OnPickerBootstrap, OnPickerClose {
    private configService;
    private appCompiler;
    private static options;
    private server;
    private watcher;
    constructor(configService: ConfigService, appCompiler: UiAppCompiler);
    static init(options: AdminUiOptions): Type<AdminUiPlugin>;
    static configure(config: RuntimePickerConfig): Promise<RuntimePickerConfig>;
    onPickerBootstrap(): Promise<void>;
    onPickerClose(): Promise<void>;
    private overwriteAdminUiConfig;
}

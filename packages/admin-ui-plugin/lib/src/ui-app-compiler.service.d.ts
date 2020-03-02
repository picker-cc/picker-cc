import { Watcher } from '@picker-cc/admin-ui/src/compiler';
import { AdminUiExtension } from '@picker-cc/common/lib/shared-types';
export declare class UiAppCompiler {
    private readonly hashfile;
    watchAdminUiApp(extensions: AdminUiExtension[] | undefined, port: number): Watcher;
    compileAdminUiApp(extensions: AdminUiExtension[] | undefined): Promise<void>;
    private normalizeExtensions;
    private extensionModulesHaveChanged;
    private getExtensionModulesHash;
    private getAllModifiedDates;
    private visitRecursive;
}

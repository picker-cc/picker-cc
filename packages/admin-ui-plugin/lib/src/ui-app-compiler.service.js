"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const compiler_1 = require("@picker-cc/admin-ui/src/compiler");
const core_1 = require("@picker-cc/core");
const crypto_1 = __importDefault(require("crypto"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
let UiAppCompiler = class UiAppCompiler {
    constructor() {
        this.hashfile = path_1.default.join(__dirname, 'modules-hash.txt');
    }
    watchAdminUiApp(extensions, port) {
        const extensionsWithId = this.normalizeExtensions(extensions);
        core_1.Logger.info(`Starting Admin UI in Angular dev server on port ${port}`, constants_1.loggerCtx);
        return compiler_1.watchAdminUiApp(extensionsWithId, port);
    }
    async compileAdminUiApp(extensions) {
        const compiledAppExists = fs_extra_1.default.existsSync(path_1.default.join(constants_1.UI_PATH, 'index.html'));
        const extensionsWithId = this.normalizeExtensions(extensions);
        if (!compiledAppExists || this.extensionModulesHaveChanged(extensionsWithId)) {
            core_1.Logger.info('Compiling Admin UI with extensions...', constants_1.loggerCtx);
            await compiler_1.compileAdminUiApp(path_1.default.join(__dirname, '../admin-ui'), extensionsWithId);
            core_1.Logger.info('Completed compilation!', constants_1.loggerCtx);
        }
        else {
            core_1.Logger.verbose('Extensions not changed since last run', constants_1.loggerCtx);
        }
    }
    normalizeExtensions(extensions) {
        return (extensions || []).map(e => {
            if (e.id) {
                return e;
            }
            const hash = crypto_1.default.createHash('sha256');
            hash.update(JSON.stringify(e));
            const id = hash.digest('hex');
            return Object.assign(Object.assign({ staticAssets: [] }, e), { id });
        });
    }
    extensionModulesHaveChanged(extensions) {
        fs_extra_1.default.ensureFileSync(this.hashfile);
        const previousHash = fs_extra_1.default.readFileSync(this.hashfile, 'utf-8');
        if (!previousHash && (!extensions || extensions.length === 0)) {
            return false;
        }
        const currentHash = this.getExtensionModulesHash(extensions);
        if (currentHash === previousHash) {
            return false;
        }
        fs_extra_1.default.writeFileSync(this.hashfile, currentHash, 'utf-8');
        return true;
    }
    getExtensionModulesHash(extensions) {
        let modifiedDates = [];
        for (const extension of extensions) {
            modifiedDates = [...modifiedDates, ...this.getAllModifiedDates(extension.extensionPath)];
        }
        const hash = crypto_1.default.createHash('sha256');
        hash.update(modifiedDates.join('') + JSON.stringify(extensions));
        return hash.digest('hex');
    }
    getAllModifiedDates(dirPath) {
        const modifiedDates = [];
        this.visitRecursive(dirPath, filePath => {
            modifiedDates.push(fs_extra_1.default.statSync(filePath).mtimeMs.toString());
        });
        return modifiedDates;
    }
    visitRecursive(dirPath, visitor) {
        const files = fs_extra_1.default.readdirSync(dirPath);
        for (const file of files) {
            const fullPath = path_1.default.join(dirPath, file);
            if (fs_extra_1.default.statSync(fullPath).isDirectory()) {
                this.visitRecursive(fullPath, visitor);
            }
            else {
                visitor(fullPath);
            }
        }
    }
};
UiAppCompiler = __decorate([
    common_1.Injectable()
], UiAppCompiler);
exports.UiAppCompiler = UiAppCompiler;
//# sourceMappingURL=ui-app-compiler.service.js.map
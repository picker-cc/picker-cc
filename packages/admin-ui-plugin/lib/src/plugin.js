"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AdminUiPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
const shared_constants_1 = require("@picker-cc/common/lib/shared-constants");
const core_1 = require("@picker-cc/core");
const express_1 = __importDefault(require("express"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const ui_app_compiler_service_1 = require("./ui-app-compiler.service");
let AdminUiPlugin = AdminUiPlugin_1 = class AdminUiPlugin {
    constructor(configService, appCompiler) {
        this.configService = configService;
        this.appCompiler = appCompiler;
    }
    static init(options) {
        this.options = options;
        return AdminUiPlugin_1;
    }
    static async configure(config) {
        const route = 'admin';
        config.middleware.push({
            handler: core_1.createProxyHandler(Object.assign(Object.assign({}, this.options), { route: 'admin', label: 'Admin UI', basePath: this.options.watch ? 'admin' : undefined })),
            route,
        });
        if (this.options.watch) {
            config.middleware.push({
                handler: core_1.createProxyHandler(Object.assign(Object.assign({}, this.options), { route: 'sockjs-node', label: 'Admin UI live reload', basePath: 'sockjs-node' })),
                route: 'sockjs-node',
            });
        }
        return config;
    }
    async onPickerBootstrap() {
        const { adminApiPath, authOptions } = this.configService;
        const { apiHost, apiPort, extensions, watch, port } = AdminUiPlugin_1.options;
        let adminUiConfigPath;
        if (watch) {
            this.watcher = this.appCompiler.watchAdminUiApp(extensions, port);
            adminUiConfigPath = path_1.default.join(__dirname, '../../../admin-ui/src', 'picker-ui-config.json');
        }
        else {
            const adminUiPath = await this.appCompiler.compileAdminUiApp(extensions);
            const adminUiServer = express_1.default();
            adminUiServer.use(express_1.default.static(constants_1.UI_PATH));
            adminUiServer.use((req, res) => {
                res.sendFile(path_1.default.join(constants_1.UI_PATH, 'index.html'));
            });
            this.server = adminUiServer.listen(AdminUiPlugin_1.options.port);
            adminUiConfigPath = path_1.default.join(constants_1.UI_PATH, 'picker-ui-config.json');
        }
        await this.overwriteAdminUiConfig({
            host: apiHost || 'auto',
            port: apiPort || 'auto',
            adminApiPath,
            authOptions,
            adminUiConfigPath,
        });
    }
    async onPickerClose() {
        if (this.watcher) {
            this.watcher.close();
        }
        if (this.server) {
            await new Promise(resolve => this.server.close(() => resolve()));
        }
    }
    async overwriteAdminUiConfig(options) {
        const { host, port, adminApiPath, authOptions, adminUiConfigPath } = options;
        const adminUiConfig = await fs_extra_1.default.readFile(adminUiConfigPath, 'utf-8');
        let config;
        try {
            config = JSON.parse(adminUiConfig);
        }
        catch (e) {
            throw new Error('[AdminUiPlugin] Could not parse picker-ui-config.json file:\n' + e.message);
        }
        config.apiHost = host || 'http://localhost';
        config.apiPort = port;
        config.adminApiPath = adminApiPath;
        config.tokenMethod = authOptions.tokenMethod || 'cookie';
        config.authTokenHeaderKey = authOptions.authTokenHeaderKey || shared_constants_1.DEFAULT_AUTH_TOKEN_HEADER_KEY;
        await fs_extra_1.default.writeFile(adminUiConfigPath, JSON.stringify(config, null, 2));
    }
};
AdminUiPlugin = AdminUiPlugin_1 = __decorate([
    core_1.PickerPlugin({
        imports: [core_1.PluginCommonModule],
        providers: [ui_app_compiler_service_1.UiAppCompiler],
        configuration: config => AdminUiPlugin_1.configure(config),
    }),
    __metadata("design:paramtypes", [core_1.ConfigService, ui_app_compiler_service_1.UiAppCompiler])
], AdminUiPlugin);
exports.AdminUiPlugin = AdminUiPlugin;
//# sourceMappingURL=plugin.js.map
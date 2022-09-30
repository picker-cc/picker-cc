"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AdminUiPlugin = void 0;
var express_1 = require("express");
// import fs from 'fs-extra';
// import path, {join} from 'path';
//
// import {
//     defaultAvailableLanguages,
//     defaultLanguage,
//     defaultLocale,
//     DEFAULT_APP_PATH,
//     loggerCtx,
// } from './constants';
var core_1 = require("@picker-cc/core");
// import {DEFAULT_AUTH_TOKEN_HEADER_KEY} from "@picker-cc/common/lib/shared-constants";
// import {initialSSRDevProxy} from "ssr-common-utils";
var env_1 = require("./utils/env");
var resolve_path_1 = require("./utils/resolve-path");
var get_vite_server_1 = require("./get-vite-server");
var users_module_1 = require("./users/users.module");
var vite_plugin_ssr_1 = require("vite-plugin-ssr");
/**
 * @description
 * This plugin starts a static server for the Admin UI app, and proxies it via the `/admin/` path of the main Vendure server.
 *
 * The Admin UI allows you to administer all aspects of your store, from inventory management to order tracking. It is the tool used by
 * store administrators on a day-to-day basis for the management of the store.
 *
 * ## Installation
 *
 * `yarn add \@vendure/admin-ui-plugin`
 *
 * or
 *
 * `npm install \@vendure/admin-ui-plugin`
 *
 * @example
 * ```ts
 * import { AdminUiPlugin } from '\@vendure/admin-ui-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     AdminUiPlugin.init({ port: 3002 }),
 *   ],
 * };
 * ```
 *
 * @docsCategory AdminUiPlugin
 */
var AdminUiPlugin = /** @class */ (function () {
    function AdminUiPlugin(configService, processContext) {
        this.configService = configService;
        this.processContext = processContext;
    }
    AdminUiPlugin_1 = AdminUiPlugin;
    /**
     * @description
     * Set the plugin options
     */
    AdminUiPlugin.init = function (options) {
        this.options = options;
        return AdminUiPlugin_1;
    };
    AdminUiPlugin.prototype.configure = function (consumer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, app, hostname, route, adminUiConfig, adminUiServer, TEMPLATE_PLACEHOLDER, vite;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = AdminUiPlugin_1.options, app = _a.app, hostname = _a.hostname, route = _a.route, adminUiConfig = _a.adminUiConfig;
                        if (this.processContext.isWorker) {
                            return [2 /*return*/];
                        }
                        adminUiServer = express_1["default"].Router();
                        TEMPLATE_PLACEHOLDER = '<!-- template-placeholder -->';
                        if (!env_1.isProduction) return [3 /*break*/, 1];
                        adminUiServer.use(express_1["default"].static((0, resolve_path_1.resolveDistPath)('client')));
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, (0, get_vite_server_1.getViteServer)()];
                    case 2:
                        vite = _b.sent();
                        // const users = await this.configService.context.db['User'].findMany()
                        consumer.apply(vite.middlewares, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                            var pageContextInit, pageContext, httpResponse, body, statusCode, contentType;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        pageContextInit = {
                                            urlOriginal: req.originalUrl,
                                            pageProps: {
                                                hello: 'mypassword'
                                            }
                                        };
                                        return [4 /*yield*/, (0, vite_plugin_ssr_1.renderPage)(pageContextInit)];
                                    case 1:
                                        pageContext = _a.sent();
                                        httpResponse = pageContext.httpResponse;
                                        if (!httpResponse)
                                            return [2 /*return*/, next()];
                                        body = httpResponse.body, statusCode = httpResponse.statusCode, contentType = httpResponse.contentType;
                                        res.status(statusCode).type(contentType).send(body);
                                        return [2 /*return*/];
                                }
                            });
                        }); }).forRoutes(route);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var AdminUiPlugin_1;
    AdminUiPlugin = AdminUiPlugin_1 = __decorate([
        (0, core_1.PickerPlugin)({
            imports: [
                core_1.PluginCommonModule,
                users_module_1.UsersModule,
                // ViteSsrModule.forRoot({
                //     root: join(__dirname, "..", "src"),
                //     configFile: join(__dirname, "..", "config", "vite.client.config.ts"),
                // }),
            ],
            controllers: [
            // AppController
            ],
            providers: []
        })
    ], AdminUiPlugin);
    return AdminUiPlugin;
}());
exports.AdminUiPlugin = AdminUiPlugin;

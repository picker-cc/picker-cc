"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AppController = void 0;
var fs_1 = require("fs");
var common_1 = require("@nestjs/common");
var get_vite_server_1 = require("./get-vite-server");
var env_1 = require("./utils/env");
var resolve_path_1 = require("./utils/resolve-path");
var TEMPLATE_PLACEHOLDER = '<!-- template-placeholder -->';
var ROUTES_PATH = (0, fs_1.readdirSync)((0, resolve_path_1.resolveClientPath)('pages'), {
    encoding: 'utf-8'
})
    .filter(function (path) { return /\.vue$/.test(path); })
    .map(function (path) {
    var name = path.match(/(.*)\.vue$/)[1].toLowerCase();
    var routePath = "/".concat(name);
    if (routePath === '/home') {
        return '/';
    }
    return routePath;
});
// @Controller(ROUTES_PATH)
var AppController = /** @class */ (function () {
    function AppController() {
    }
    AppController.prototype.renderApp = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var url, vite, html, render, template, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = request.originalUrl;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        if (!env_1.isProduction) return [3 /*break*/, 3];
                        html = (0, fs_1.readFileSync)((0, resolve_path_1.resolveDistPath)('client', 'index.html'), {
                            encoding: 'utf-8'
                        });
                        return [4 /*yield*/, Promise.resolve().then(function () { return require((0, resolve_path_1.resolveDistPath)('server', 'entry-server.js')); })];
                    case 2:
                        render = (_a.sent())
                            .render;
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, (0, get_vite_server_1.getViteServer)()];
                    case 4:
                        vite = _a.sent();
                        return [4 /*yield*/, vite.transformIndexHtml(url, (0, fs_1.readFileSync)((0, resolve_path_1.resolveClientPath)('index.html'), {
                                encoding: 'utf-8'
                            }))];
                    case 5:
                        html = _a.sent();
                        return [4 /*yield*/, vite.ssrLoadModule((0, resolve_path_1.resolveClientPath)('entry-server.ts'))];
                    case 6:
                        render = (_a.sent()).render;
                        _a.label = 7;
                    case 7: return [4 /*yield*/, render(url)];
                    case 8:
                        template = (_a.sent()).template;
                        return [2 /*return*/, html.replace(TEMPLATE_PLACEHOLDER, template)];
                    case 9:
                        error_1 = _a.sent();
                        vite && vite.ssrFixStacktrace(error_1);
                        throw new common_1.InternalServerErrorException(error_1);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, common_1.Header)('Content-Type', 'text/html'),
        __param(0, (0, common_1.Req)())
    ], AppController.prototype, "renderApp");
    return AppController;
}());
exports.AppController = AppController;

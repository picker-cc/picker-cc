import {InternalServerErrorException, MiddlewareConsumer, NestModule} from '@nestjs/common';

import express from 'express';
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
import {
    AdminUiAppConfig, AdminUiAppDevModeConfig,
    AdminUiConfig, ConfigService,
    createProxyHandler,
    Logger, PickerPlugin, PluginCommonModule, ProcessContext,
    registerPluginStartupMessage, Type
} from "@picker-cc/core";
// import {DEFAULT_AUTH_TOKEN_HEADER_KEY} from "@picker-cc/common/lib/shared-constants";
// import {initialSSRDevProxy} from "ssr-common-utils";
import {isProduction} from './utils/env';
import {resolveClientPath, resolveDistPath} from "./utils/resolve-path";
import {getViteServer} from "./get-vite-server";
// import {ViteSsrModule} from "./vite-ssr/ssr.module";
// import {join} from "path";
import {AppController} from "./app.controller";
import {UsersModule} from "./users/users.module";
import fs from "fs-extra";
import path from "path";
import {ViteDevServer} from "vite";
import {readFileSync} from "fs";
import {renderPage} from 'vite-plugin-ssr'

/**
 * @description
 * Configuration options for the {@link AdminUiPlugin}.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiPluginOptions {
    /**
     * @description
     * The route to the Admin UI.
     */
    route: string;
    /**
     * @description
     * The port on which the server will listen. This port will be proxied by the AdminUiPlugin to the same port that
     * the Vendure server is running on.
     */
    port: number;
    /**
     * @description
     * The hostname of the server serving the static admin ui files.
     *
     * @default 'localhost'
     */
    hostname?: string;
    /**
     * @description
     * By default, the AdminUiPlugin comes bundles with a pre-built version of the
     * Admin UI. This option can be used to override this default build with a different
     * version, e.g. one pre-compiled with one or more ui extensions.
     */
    app?: AdminUiAppConfig | AdminUiAppDevModeConfig;
    /**
     * @description
     * Allows the contents of the `vendure-ui-config.json` file to be set, e.g.
     * for specifying the Vendure GraphQL API host, available UI languages, etc.
     */
    adminUiConfig?: Partial<AdminUiConfig>;
}

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
@PickerPlugin({
    imports: [
        PluginCommonModule,
        UsersModule,
        // ViteSsrModule.forRoot({
        //     root: join(__dirname, "..", "src"),
        //     configFile: join(__dirname, "..", "config", "vite.client.config.ts"),
        // }),
    ],
    controllers: [
        // AppController
    ],
    providers: [],
})
export class AdminUiPlugin implements NestModule {
    private static options: AdminUiPluginOptions;

    constructor(private configService: ConfigService, private processContext: ProcessContext) {
    }

    /**
     * @description
     * Set the plugin options
     */
    static init(options: AdminUiPluginOptions): Type<AdminUiPlugin> {
        this.options = options;
        return AdminUiPlugin;
    }

    async configure(consumer: MiddlewareConsumer) {
        const {app, hostname, route, adminUiConfig} = AdminUiPlugin.options;

        if (this.processContext.isWorker) {
            return;
        }
        // const { app, hostname, route, adminUiConfig } = AdminUiPlugin.options;
        // const adminUiAppPath = (app && app.path) || DEFAULT_APP_PATH;
        //

        const adminUiServer = express.Router();

        // adminUiServer.use(express.static(adminUiAppPath));
        // adminUiServer.use((req, res) => {
        //     res.sendFile(path.join(adminUiAppPath, 'index.html'));
        // });
        const TEMPLATE_PLACEHOLDER = '<!-- template-placeholder -->';

        if (isProduction) {
            adminUiServer.use(express.static(resolveDistPath('client')));
            // adminUiServer.use(compression());
        } else {
            const vite = await getViteServer();
            // const users = await this.configService.context.db['User'].findMany()
            consumer.apply(
                vite.middlewares,
                async (req, res, next) => {
                    const pageContextInit = {
                        urlOriginal: req.originalUrl,
                        pageProps: {
                            hello: 'mypassword',
                            // users,
                        }
                    }
                    const pageContext = await renderPage(pageContextInit)
                    const {httpResponse} = pageContext
                    if (!httpResponse) return next()
                    const {body, statusCode, contentType} = httpResponse
                    res.status(statusCode).type(contentType).send(body)
                }).forRoutes(route)

            // adminUiServer.use('*', async (request, response) => {
            //     const {renderApp, renderError} = await vite.ssrLoadModule(resolveClientPath('ssr.ts'))
            //     let template = fs.readFileSync(path.resolve(ROOT_PATH, 'index.html'), 'utf-8')
            //
            //     try {
            //         const url = request.originalUrl
            //         template = await viteServer.transformIndexHtml(url, template)
            //         const redered: RenderResult = await renderApp(request, cache)
            //         response
            //             .status(redered.code)
            //             .set({'Content-Type': 'text/html'})
            //             .end(
            //                 resolveTemplate({
            //                     template,
            //                     appHTML: redered.html,
            //                     // metas: redered.metas,
            //                     metas: '',
            //                     scripts: redered.scripts
            //                 })
            //             )
            //     } catch (error: any) {
            //         viteServer.ssrFixStacktrace(error)
            //         const redered: RenderResult = await renderError(request, error)
            //         response.status(redered.code).end(
            //             resolveTemplate({
            //                 template,
            //                 appHTML: redered.html,
            //                 // metas: redered.metas,
            //                 metas: '',
            //                 scripts: redered.scripts
            //             })
            //         )
            //     }
            // })

            // consumer.apply(adminUiServer).forRoutes(route)

        }

        // console.log(route)
        // consumer.apply(adminUiServer).forRoutes(route)

        // adminUiServer.get('*', async (req, res, next) => {
        //     const pageContextInit = {
        //         urlOriginal: req.originalUrl
        //     }
        // const pageContext = await renderPage(pageContextInit)
        // const { httpResponse } = pageContext
        // if (!httpResponse) return next()
        // const { body, statusCode, contentType } = httpResponse
        // res.status(statusCode).type(contentType).send(body)
        // })


    }

}

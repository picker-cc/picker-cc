import { MiddlewareConsumer, NestModule } from '@nestjs/common';

import express from 'express';
import fs from 'fs-extra';
import path, {join} from 'path';

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
import {PUBLIC_PATH, ROOT_PATH} from "./server/helpers/configurer";
// import {DEFAULT_AUTH_TOKEN_HEADER_KEY} from "@picker-cc/common/lib/shared-constants";
// import {initialSSRDevProxy} from "ssr-common-utils";
// import {isDev, NODE_ENV} from "./environment";
// import {getBFFServerPort} from "./config/bff.config";
// import {enableDevRenderer} from "@/server/renderer/dev";
// import {enableProdRenderer} from "@/server/renderer/prod";
import {initCacheClient} from "./server/cache";
import {createServer} from "vite";
import {RenderResult} from "./ssr";
import {resolveTemplate} from "./server/renderer/template";
import {resolveClientPath} from "./utils/resolve-path";

// @ts-expect-error
process.noDeprecation = true
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
    imports: [PluginCommonModule],
    providers: [],
})
export class AdminUiPlugin implements NestModule {
    private static options: AdminUiPluginOptions;

    constructor(private configService: ConfigService, private processContext: ProcessContext) {}

    /**
     * @description
     * Set the plugin options
     */
    static init(options: AdminUiPluginOptions): Type<AdminUiPlugin> {
        this.options = options;
        return AdminUiPlugin;
    }

    async configure(consumer: MiddlewareConsumer) {
        if (this.processContext.isWorker) {
            return;
        }
        const cache = await initCacheClient()

        const { app, hostname, route, adminUiConfig } = AdminUiPlugin.options;
        // const adminUiAppPath = (app && app.path) || DEFAULT_APP_PATH;

        const adminUiServer = express.Router();
        adminUiServer.use(express.static(PUBLIC_PATH))

        const viteServer = await createServer({
            root: process.cwd(),
            logLevel: 'info',
            server: {
                middlewareMode: 'ssr',
                watch: {
                    usePolling: true,
                    interval: 100
                }
            }
        })
        adminUiServer.use(viteServer.middlewares)
        adminUiServer.use('*', async (request, response) => {
            const {renderApp, renderError} = await viteServer.ssrLoadModule(resolveClientPath('ssr.ts'))
            let template = fs.readFileSync(path.resolve(ROOT_PATH, 'index.html'), 'utf-8')

            try {
                const url = request.originalUrl
                template = await viteServer.transformIndexHtml(url, template)
                const redered: RenderResult = await renderApp(request, cache)
                response
                    .status(redered.code)
                    .set({'Content-Type': 'text/html'})
                    .end(
                        resolveTemplate({
                            template,
                            appHTML: redered.html,
                            // metas: redered.metas,
                            metas: '',
                            scripts: redered.scripts
                        })
                    )
            } catch (error: any) {
                viteServer.ssrFixStacktrace(error)
                const redered: RenderResult = await renderError(request, error)
                response.status(redered.code).end(
                    resolveTemplate({
                        template,
                        appHTML: redered.html,
                        // metas: redered.metas,
                        metas: '',
                        scripts: redered.scripts
                    })
                )
            }
        })

        consumer.apply(adminUiServer).forRoutes(route)
        // isDev ? enableDevRenderer(adminUiServer, cache) : enableProdRenderer(adminUiServer, cache)

        // adminUiServer.use(express.static(adminUiAppPath));
        // adminUiServer.use((req, res) => {
        //     res.sendFile(path.join(adminUiAppPath, 'index.html'));
        // });
    }

}

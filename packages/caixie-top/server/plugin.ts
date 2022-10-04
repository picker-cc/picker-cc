import {MiddlewareConsumer, NestModule} from '@nestjs/common';

import express from 'express';

import {
    ConfigService,
    createProxyHandler,
    Logger,
    PickerPlugin,
    PluginCommonModule, ProcessContext,
    registerPluginStartupMessage, Type,
    ConfigModule, EventBusModule,
} from "@picker-cc/core";
import {isProduction} from './utils/env';
import {resolveClientPath, resolveDistPath} from "./utils/resolve-path";
import {getViteServer} from "./get-vite-server";
import {renderPage} from 'vite-plugin-ssr'
import {UsersService} from "./users/users.service";
import {WeChatModule} from "@picker-cc/wechat-plugin";
import {UsersController} from "./users/users.controller";

/**
 * @description
 */
export interface PluginOptions {
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
}

@PickerPlugin({
    imports: [
        PluginCommonModule,
        // UsersModule,
        WeChatModule,
    ],
    providers: [
        UsersService
    ],
    controllers: [
        UsersController
        // AppController
    ],
})
export class CaixieAppPlugin implements NestModule {
    private static options: PluginOptions;

    constructor(private configService: ConfigService, private processContext: ProcessContext) {
    }

    /**
     * @description
     * Set the plugin options
     */
    static init(options: PluginOptions): Type<CaixieAppPlugin> {
        this.options = options;
        return CaixieAppPlugin;
    }

    async configure(consumer: MiddlewareConsumer) {
        const {route} = CaixieAppPlugin.options;

        if (this.processContext.isWorker) {
            return;
        }

        const appUiServer = express.Router();

        const TEMPLATE_PLACEHOLDER = '<!-- template-placeholder -->';

        if (isProduction) {
            appUiServer.use(express.static(resolveDistPath('client')));
            // adminUiServer.use(compression());
        } else {
            const vite = await getViteServer();
            // const users = await this.configService.context.db['User'].findMany()
            consumer.apply(
                vite.middlewares,
                async (req: any, res: any, next: any) => {
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


        }

    }

}

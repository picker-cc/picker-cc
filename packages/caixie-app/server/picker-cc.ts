import {config, createAuth, DefaultLogger, LogLevel, PickerConfig, statelessSessions} from '@picker-cc/core';
import {ADMIN_API_PATH, API_PORT} from "@picker-cc/common/lib/shared-constants";

import {User} from "../schemas/User";
import path from "path";
import {AssetServerPlugin} from "@picker-cc/asset-server-plugin";
import {CaixieAppPlugin} from "./plugin";
// import {AdminUiPlugin} from "@picker-cc/ssr-vue";
const sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
const sessionConfig = {
    maxAge: sessionMaxAge,
    secret: sessionSecret,
};

const schemaConfig = config({
    db: {
        provider: 'sqlite',
        url: 'file:./dev.db',
    },
    models: {
        User
    },
    session: statelessSessions(sessionConfig),
    experimental: {
        generateNodeAPI: true
    }
})
const {withAuth} = createAuth({
    listKey: 'User',
    identityField: 'identifier',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'identifier', 'password']
    },
    // sessionData: `
    // `
})

const withAuthConfig = withAuth(schemaConfig)
export default withAuthConfig
/**
 * 配置开发期间使用的设置
 */
export const pickerConfig: PickerConfig = {
    // graphqlSchema: customSchema,
    // context: schemaContext,
    schemaConfig: withAuthConfig,
    context: null,
    apiOptions: {
        port: API_PORT,
        adminApiPath: ADMIN_API_PATH,
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },
        adminApiDebug: true,
        // cors: true,
    },
    authOptions: {
        tokenMethod: ['bearer'] as const,
        requireVerification: true,
        customPermissions: [],
        cookieOptions: {
            secret: 'abc',
        }
    },
    dbConnectionOptions: {
        // ...getDbConfig(),
    },
    logger: new DefaultLogger({ level: LogLevel.Info}),
    plugins: [
        CaixieAppPlugin.init({
            route: 'homepage',
            port: 5001
        })
    ],

};


import {config, createAuth, DefaultLogger, LogLevel, PickerConfig, statelessSessions} from '@picker-cc/core';
import {ADMIN_API_PATH, API_PORT} from "@picker-cc/common/lib/shared-constants";

import {User} from "../schemas/User";
import {Post} from "../schemas/Post"
import {CaixieAppPlugin} from "./plugin";
import {WechatPlugin} from "@picker-cc/wechat-plugin";
import {AliSmsPlugin} from "@picker-cc/ali-sms-plugin";
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
        User,
        Post,
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
        fields: ['name', 'identifier', 'password'],
        itemData: {
            isAdmin: true
        }
    },
    sessionData: `name isAdmin`
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
        WechatPlugin.init({
            appId: 'wx40f58df735cd2868',
            secret: '97fe8be8948c6819bd8b547951201a45',
            token: 'PickerCC',
        }),
        AliSmsPlugin.init({
            accessKeyId: 'LTAI5tL5kvxz5VVwoipF2Z7H',
            accessKeySecret: 'EY3SnfG5KlHVFa7hfPro4mgwrbutv5',
            SignName: '采撷科技',
            TemplateCode_Code: 'SMS_89285012',
            codeSize: 6,
        }),
        CaixieAppPlugin.init({
            route: 'admin',
            port: 5001
        })
    ],

};


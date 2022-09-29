import {CACHE_MANAGER, MiddlewareConsumer, NestModule, OnModuleInit} from "@nestjs/common";
import {EventBus, Logger, PickerPlugin, PluginCommonModule, Type} from "@picker-cc/core";
import {generateCode} from "@picker-cc/common/lib/generate-public-id";
import {SmsEvent} from "./sms-event";
import {debounceTime} from "rxjs";
import {SMSOptions} from "./types";

const Core = require('@alicloud/pop-core');



@PickerPlugin({
    imports: [PluginCommonModule],
    providers: [
        // {
        //     provide: WeChatService,
        //     useValue: new WeChatService(WechatPlugin.options),
        // }
    ],
    exports: []
})
export class AliSmsPlugin implements NestModule, OnModuleInit {

    private static options: SMSOptions;
    private static smsClient: any;

    constructor(
        private eventBus: EventBus,
    ) {
    }

    static init(options: SMSOptions): Type<AliSmsPlugin> {
        AliSmsPlugin.options = Object.assign(
            {},
            options,
            options.endpoint ?? 'https://dysmsapi.aliyuncs.com',
            options.apiVersion ?? '2017-05-25'
        )
        AliSmsPlugin.smsClient = new Core(options)
        return this;
    }

    configure(consumer: MiddlewareConsumer): any {
        Logger.info('Creating Wechat server middleware');
    }

    onModuleInit() {
        const smsEvent$ = this.eventBus.ofType(SmsEvent)
        smsEvent$.pipe(debounceTime(50)).subscribe(
            async (event: SmsEvent) => {
                const phone = event.phone
                await this.sendCode(phone)
            }
        )
    }

    /**
     *
     * 发送验证码
     * @param phone string 手机号
     */
    sendCode(phone: string) {
        return new Promise(async (resolve, reject) => {
            let code = generateCode(4);
            let params = {
                "PhoneNumbers": phone,
                "SignName": AliSmsPlugin.options.SignName,
                "TemplateCode": AliSmsPlugin.options.TemplateCode_Code,
                "TemplateParam": JSON.stringify({
                    code: code
                })
            }
            let requestOption = {
                method: 'POST'
            };
            let r: any;
            try {
                r = await AliSmsPlugin.smsClient.request('SendSms', params, requestOption);
            } catch (error) {
                reject(error);
            }
            if (r.Code == 'OK') {
                resolve(code);
            } else {
                reject(r);
            }
        });

    }
}

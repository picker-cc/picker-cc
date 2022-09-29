import {CACHE_MANAGER, MiddlewareConsumer, NestModule, OnModuleInit} from "@nestjs/common";
import {EventBus, Logger, PickerPlugin, PluginCommonModule, Type} from "@picker-cc/core";
import {SmsEvent} from "./sms-event";
import {debounceTime} from "rxjs";
import {SMSOptions} from "./types";

const Core = require('@alicloud/pop-core');



@PickerPlugin({
    imports: [PluginCommonModule],
})
export class AliSmsPlugin implements NestModule, OnModuleInit {

    private static options: SMSOptions;
    private static smsClient: any;

    constructor(
        private eventBus: EventBus,
    ) {
    }

    static init(options: SMSOptions): Type<AliSmsPlugin> {
        options = {
            ...options,
            endpoint: 'https://dysmsapi.aliyuncs.com',
            apiVersion: '2017-05-25',
        }
        // AliSmsPlugin.options = Object.assign(
        //     {},
        //     options,
        //     options.endpoint ?? 'https://dysmsapi.aliyuncs.com',
        //     options.apiVersion ?? '2017-05-25'
        // )
        AliSmsPlugin.options = options
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
                console.log('收到短信事件')
                console.log(event)
                const phone = event.phone
                const code = event.content
                await this.sendCode(phone, AliSmsPlugin.options.codeSize, code)
            }
        )
    }

    /**
     *
     * 发送验证码
     * @param phone string 手机号
     */
    sendCode(phone: string, codesize: number, code: string) {
        return new Promise(async (resolve, reject) => {
            // let code = generateCode(codesize);
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

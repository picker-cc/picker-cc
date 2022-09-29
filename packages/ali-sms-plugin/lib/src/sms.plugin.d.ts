import { MiddlewareConsumer, NestModule, OnModuleInit } from "@nestjs/common";
import { EventBus, Type } from "@picker-cc/core";
import { SMSOptions } from "./types";
export declare class AliSmsPlugin implements NestModule, OnModuleInit {
    private eventBus;
    private static options;
    private static smsClient;
    constructor(eventBus: EventBus);
    static init(options: SMSOptions): Type<AliSmsPlugin>;
    configure(consumer: MiddlewareConsumer): any;
    onModuleInit(): void;
    /**
     *
     * 发送验证码
     * @param phone string 手机号
     */
    sendCode(phone: string): Promise<unknown>;
}

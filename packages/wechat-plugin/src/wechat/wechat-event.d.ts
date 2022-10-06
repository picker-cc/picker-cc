import { PickerEvent, RequestContext } from "@picker-cc/core";
export declare class WechatEvent extends PickerEvent {
    ctx: RequestContext;
    type: 'action';
    constructor(ctx: RequestContext, type: 'action');
}

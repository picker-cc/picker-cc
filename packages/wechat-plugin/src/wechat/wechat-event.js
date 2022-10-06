"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatEvent = void 0;
const core_1 = require("@picker-cc/core");
class WechatEvent extends core_1.PickerEvent {
    constructor(ctx, type) {
        super();
        this.ctx = ctx;
        this.type = type;
    }
}
exports.WechatEvent = WechatEvent;
//# sourceMappingURL=wechat-event.js.map
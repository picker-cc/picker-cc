"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsEvent = void 0;
const core_1 = require("@picker-cc/core");
class SmsEvent extends core_1.PickerEvent {
    constructor(phone, type) {
        super();
        this.phone = phone;
        this.type = type;
    }
}
exports.SmsEvent = SmsEvent;
//# sourceMappingURL=sms-event.js.map
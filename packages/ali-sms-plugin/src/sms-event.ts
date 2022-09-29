import {PickerEvent} from "@picker-cc/core";

export class SmsEvent extends PickerEvent {
    constructor(
        public phone: string,
        public type: 'sms'
    ) {
        super()
    }

}

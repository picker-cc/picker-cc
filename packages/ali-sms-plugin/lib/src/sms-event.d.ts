import { PickerEvent } from "@picker-cc/core";
export declare class SmsEvent extends PickerEvent {
    phone: string;
    type: 'sms';
    constructor(phone: string, type: 'sms');
}

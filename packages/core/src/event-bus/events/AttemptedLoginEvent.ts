/**
 * @description
 * 当尝试 “login” 登录时，将触发此事件。
 *
 * @docsCategory events
 * @docsPage Event Types
 */
import {RequestContext} from '../../api/common/request-context';
import {PickerEvent} from '../picker-event';

// import { RequestContext } from '@app/common/request-context';

export class AttemptedLoginEvent extends PickerEvent {
  constructor(public ctx: RequestContext, public identifier: string) {
    super();
  }
}

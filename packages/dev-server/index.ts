import {bootstrap} from '@picker-cc/core'

import { devConfig } from './dev-config';

bootstrap(devConfig).catch(err => {
  // tslint:disable-next-line:no-console
  console.log(err);
})

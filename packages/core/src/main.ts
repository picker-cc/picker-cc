import {bootstrap} from './bootstrap';
import { devConfig } from './dev-config';

bootstrap(devConfig).catch(err => {
  // tslint:disable-next-line:no-console
  console.log(err);
})

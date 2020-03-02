
/* tslint:disable:no-console */
import {compileAdminUiApp} from '@picker-cc/admin-ui/src/compiler';
import path from 'path';

console.log('Building admin-ui from source...');
compileAdminUiApp(path.join(__dirname, 'lib/admin-ui'), []);

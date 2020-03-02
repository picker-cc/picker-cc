// import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {NgModule} from '@angular/core';
import { ClarityModule } from '@clr/angular';

const IMPORTS = [
  // NgZorroAntdModule
  ClarityModule
];

@NgModule({
  imports: IMPORTS,
  exports: [ ...IMPORTS ]
})
export class SharedModule {

}

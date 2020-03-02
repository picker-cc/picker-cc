import {SharedModule} from '../shared/shared.module';
import {NgModule} from '@angular/core';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [ SharedModule ],
  exports: [ SharedModule ]
})
export class CoreModule {
}

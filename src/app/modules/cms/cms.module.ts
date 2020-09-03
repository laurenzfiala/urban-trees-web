import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../shared/interceptors/auth.interceptor';
import {TextComponent} from './components/text/text.component';
import {TranslateModule} from '@ngx-translate/core';
import {ContentComponent} from './components/content/content.component';
import {ForNDirective} from './directives/for-n.directive';


@NgModule({
  declarations: [
    // Components
    ContentComponent,
    TextComponent,

    // Directives
    ForNDirective
  ],
  exports: [
    // Components
    ContentComponent
    // TODO
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CmsModule { }

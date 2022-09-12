import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActionDirective} from './directives/action.directive';
import {CssVariableDirective} from './directives/css-variable.directive';
import {SpyDirective} from './directives/spy.directive';
import {AuthDirective} from './directives/auth.directive';
import {NoAuthDirective} from './directives/noauth.directive';
import {CheckDirective} from './directives/check.directive';
import {ValueaccessorDirective} from './directives/valueaccessor.directive';
import {LangDirective} from './directives/lang.directive';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {ForNDirective} from './directives/for-n.directive';
import {FocusOnDisplayDirective} from './directives/focus-on-display.directive';
import {ZoomComponent} from './components/zoom/zoom.component';
import {TranslateModule} from '@ngx-translate/core';
import {AuthPipe} from './pipes/auth.pipe';
import {CastDirective} from './directives/cast.directive';
import {ListComponent} from './components/list/list.component';
import {MapEntriesPipe} from './pipes/map-entries.pipe';
import {Async2Pipe} from './pipes/async2.pipe';

@NgModule({
  declarations: [
    // Components
    ZoomComponent,
    ListComponent,

    // Directives
    ActionDirective,
    CssVariableDirective,
    SpyDirective,
    AuthDirective,
    NoAuthDirective,
    CheckDirective,
    ValueaccessorDirective,
    LangDirective,
    ForNDirective,
    FocusOnDisplayDirective,
    CastDirective,

    // Pipes
    AuthPipe,
    MapEntriesPipe,
    Async2Pipe
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    // Components
    ZoomComponent,
    ListComponent,

    // Directives
    ActionDirective,
    CssVariableDirective,
    SpyDirective,
    AuthDirective,
    NoAuthDirective,
    CheckDirective,
    ValueaccessorDirective,
    LangDirective,
    ForNDirective,
    FocusOnDisplayDirective,
    CastDirective,

    // Pipes
    AuthPipe,
    MapEntriesPipe,
    Async2Pipe
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
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActionDirective} from './directives/action.directive';
import {CssVariableDirective} from './directives/css-variable.directive';
import {AuthService} from './services/auth.service';
import {SpyDirective} from './directives/spy.directive';
import {AuthDirective} from './directives/auth.directive';
import {NoAuthDirective} from './directives/noauth.directive';
import {CheckDirective} from './directives/check.directive';
import {ValueaccessorDirective} from './directives/valueaccessor.directive';
import {LangDirective} from './directives/lang.directive';
import {LayoutConfig} from '../trees/config/layout.config';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {CastDirective} from './directives/cast.directive';
import {ForNDirective} from './directives/for-n.directive';

@NgModule({
  declarations: [
    // Directives
    ActionDirective,
    CssVariableDirective,
    SpyDirective,
    AuthDirective,
    NoAuthDirective,
    CheckDirective,
    ValueaccessorDirective,
    LangDirective,
    CastDirective,
    ForNDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // Directives
    ActionDirective,
    CssVariableDirective,
    SpyDirective,
    AuthDirective,
    NoAuthDirective,
    CheckDirective,
    ValueaccessorDirective,
    LangDirective,
    CastDirective,
    ForNDirective
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

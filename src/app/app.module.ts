import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LayoutModule} from '@angular/cdk/layout';
import {VERSION} from '../environments/version';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {SharedModule} from './modules/shared/shared.module';
import {AuthService} from './modules/shared/services/auth.service';
import {EnvironmentService} from './modules/shared/services/environment.service';
import {TranslateInitService} from './modules/shared/services/translate-init.service';
import {MultiTranslateHttpLoader} from './modules/shared/lib/multi-translate-http-loader';

export function TranslateFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: '/translations/shared/', suffix: '.json'},
    {prefix: '/translations/', suffix: '.json'}
  ]);
}

@NgModule({
  declarations: [
    // Components
    AppComponent,
    LandingPageComponent
  ],
  imports: [
    // Core
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutModule,
    SharedModule,

    // Translation
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    // Services
    AuthService,
    EnvironmentService,
    TranslateInitService
  ],
  exports: [
    TranslateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
